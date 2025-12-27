
import requests
from bs4 import BeautifulSoup
import json
import time
import os

URL_BASE = "https://servicio.mapa.gob.es"
URL_HOME = "https://servicio.mapa.gob.es/regfiweb/Home/Inicio"
URL_GRID = "https://servicio.mapa.gob.es/regfiweb/Productos/ProductosGrid"
OUTPUT_FILE = "src/data/mapa_fitosanitarios_scraped.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    # Important: some endpoints might check Referer
    "Referer": "https://servicio.mapa.gob.es/regfiweb/Productos/Index"
}

def get_formulado_details(session, url_suffix):
    """
    Fetches the FORMULADO detail page to get Crops, Pests, Doses, and Table-based Composition.
    """
    if not url_suffix: return {}
    full_url = f"{URL_BASE}{url_suffix}"
    try:
        resp = session.get(full_url)
        if resp.status_code != 200: return {}
        soup = BeautifulSoup(resp.content, "html.parser")
        details = {}
        
        # 1. Composición (Table)
        comp_header = soup.find(string=lambda t: t and "Composición" in t)
        if comp_header:
            comp_table = comp_header.find_next("table")
            if comp_table:
                susts = []
                rows = comp_table.find_all("tr")
                for r in rows:
                    cols = r.find_all("td")
                    # Usually Name | Percentage ...
                    if len(cols) >= 2:
                        s_name = cols[0].get_text(strip=True)
                        s_amount = cols[1].get_text(strip=True)
                        if s_name and "Sustancia" not in s_name:
                            susts.append(f"{s_name} {s_amount}")
                if susts:
                    details['composition'] = ", ".join(susts)

        # 2. Usos Autorizados (Table)
        uses_header = soup.find(string=lambda t: t and "Usos" in t and "autorizados" in t.lower())
        if uses_header:
            uses_table = uses_header.find_next("table")
            if uses_table:
                uses_list = []
                rows = uses_table.find_all("tr")
                for r in rows:
                    if r.find("th"): continue
                    cols = r.find_all("td")
                    if len(cols) >= 3:
                        cultivo = cols[0].get_text(strip=True)
                        plaga = cols[1].get_text(strip=True)
                        dosis = cols[2].get_text(strip=True)
                        ps = cols[-1].get_text(strip=True)
                        
                        uses_list.append({
                            "crop": cultivo,
                            "pest": plaga,
                            "dose": dosis,
                            "ps": ps
                        })
                details['uses'] = uses_list
                details['crops'] = list(set(u['crop'] for u in uses_list if u.get('crop')))
                details['pests'] = list(set(u['pest'] for u in uses_list if u.get('pest')))
        
        return details
    except:
        return {}

def get_product_details(session, url_suffix):
    """
    Fetches the Detail page to extract Composition, Deadlines, Subtype, and USES (Crops/Pests).
    Returns a dict with found fields.
    """
    if not url_suffix:
        return {}
        
    full_url = f"{URL_BASE}{url_suffix}"
    try:
        detail_headers = HEADERS.copy()
        if "X-Requested-With" in detail_headers:
            del detail_headers["X-Requested-With"]

        resp = session.get(full_url, headers=detail_headers)
        if resp.status_code != 200:
            return {}
            
        soup = BeautifulSoup(resp.content, "html.parser")


        details = {}
        
        # --- 1. Basic Fields from Inputs (Fabricante, Fechas) ---
        def get_val(id_name):
            node = soup.find("input", id=id_name)
            if node and node.get("value"):
                return node.get("value").strip()
            return ""

        details['manufacturer'] = get_val("txtFabricante")
        details['inscriptionDate'] = get_val("txtFechaInscripcion")
        details['expiryDate'] = get_val("txtFechaCaducidad")
        
        # --- 2. Observaciones (Textarea) ---
        obs_node = soup.find("textarea", id="txtObservaciones")
        if obs_node:
            details['observations'] = obs_node.get_text(separator="\n", strip=True)
            
        # --- 3. Composición (AJAX) ---
        # Find the div with data-url for Sustancias
        # <div class="mvc-grid" data-url="/regfiweb/Productos/SustanciasGrid?IdProducto=96161"></div>
        sust_div = soup.find("div", attrs={"data-url": lambda x: x and "SustanciasGrid" in x})
        if sust_div:
            sub_url = sust_div['data-url']
            # Fetch AJAX
            try:
                # We need to add "X-Requested-With: XMLHttpRequest" for this one?
                # Probably yes, as it is a Grid
                res_sub = session.get(f"{URL_BASE}{sub_url}", headers={"X-Requested-With": "XMLHttpRequest"})
                if res_sub.status_code == 200:
                    bs_sub = BeautifulSoup(res_sub.content, "html.parser")
                    # Parse table rows. Usually Col 1 is Name, Col 2 is Amount?
                    # Let's verify standard grid: often headers are "Nombre", "Contenido"...
                    # We'll just grab text from rows
                    rows = bs_sub.find_all("tr")
                    comps = []
                    for r in rows:
                        if r.find("th"): continue
                        cols = r.find_all("td")
                        if len(cols) >= 2:
                             # Guessing columns: 0=Name, 1=Percentage?
                             n = cols[0].get_text(strip=True)
                             v = cols[1].get_text(strip=True)
                             if n: comps.append(f"{n} {v}")
                    details['composition'] = ", ".join(comps)
            except:
                pass

        # --- 4. Funciones / Usos (AJAX) ---
        # <div class="mvc-grid" data-url="/regfiweb/Productos/FuncionesGrid?IdProducto=96161"></div>
        func_div = soup.find("div", attrs={"data-url": lambda x: x and "FuncionesGrid" in x})
        if func_div:
            sub_url = func_div['data-url']
            try:
                res_sub = session.get(f"{URL_BASE}{sub_url}", headers={"X-Requested-With": "XMLHttpRequest"})
                if res_sub.status_code == 200:
                    bs_sub = BeautifulSoup(res_sub.content, "html.parser")
                    # Parse rows
                    rows = bs_sub.find_all("tr")
                    uses = []
                    for r in rows:
                        if r.find("th"): continue
                        cols = r.find_all("td")
                        if len(cols) >= 1:
                            # Maybe "Función" is just one column?
                            uses.append(cols[0].get_text(strip=True))
                    details['uses'] = uses # This might be "Fungicida", "Insecticida" etc.
            except:
                pass

        return details

    except Exception as e:
        return {}

def scrape_fitos():
    session = requests.Session()
    # Initial setup headers
    session.headers.update(HEADERS)
    # Add X-Requested-With for the Grid AJAX calls
    session.headers["X-Requested-With"] = "XMLHttpRequest"

    print(f"Fetching Home Page to init session: {URL_HOME}")
    try:
        session.get(URL_HOME)
        
        all_products = []
        page = 1
        
        while True:
            # print(f"Fetching Grid Page {page}...")
            

            # Pagination Params for MvcGrid
            # Usually requires "GridName-page": page
            params = {
                "_": int(time.time() * 1000), 
                "productosGrid-page": page,
                "rows": 20 
            }
            
            try:
                resp = session.get(URL_GRID, params=params)
                if resp.status_code != 200:
                    print(f"Failed to fetch page {page}: Status {resp.status_code}")
                    break
                    
                soup = BeautifulSoup(resp.content, "html.parser")
                rows = soup.find_all("tr")
                
                # Validation: No rows
                if not rows:
                    print(f"No rows found on page {page}. Stopping.")
                    break
                    
                # Collect IDs on this page to check for stagnation
                current_page_ids = []

                print(f"Page {page}: Processing {len(rows)} rows...")
                
                page_products = []
                for row in rows:
                    if row.find("th"):
                        continue
                        
                    cols = row.find_all("td")
                    # Prod Grid Cols:
                    # 0: Vigente (hidden)
                    # 1: Button (id=ProdID)
                    # 2: NumReg
                    # 3: Name
                    # 4: Titular
                    # 5: Link Formulado (href=...)
                    
                    if len(cols) >= 6:
                        try:
                            # 1. Product ID
                            btn = cols[1].find("button")
                            prod_id = btn.get("data-id") if btn else ""
                            
                            # 2. Formulado URL
                            link_form = cols[5].find("a")
                            form_url_suffix = link_form['href'] if link_form else ""
                            
                            # 3. Basic Info
                            status_text = cols[0].get_text(strip=True)
                            reg_num = cols[2].get_text(strip=True)
                            name = cols[3].get_text(strip=True)
                            manufacturer = cols[4].get_text(strip=True) # This is Tiular

                            # Duplicate Check (internal to loop if needed, but better page-level)
                            current_page_ids.append(reg_num)

                            # 4. URLs
                            prod_url_suffix = f"/regfiweb/Productos/DetalleProducto/{prod_id}" if prod_id else ""
                            
                            # 5. Deep Scrape PRODUCT Page (Obs, Dates, Real Manufacturer)
                            prod_details = get_product_details(session, prod_url_suffix)
                            
                            # 6. Deep Scrape FORMULADO Page (Crops, Pests, Composition from table)
                            # We can reuse get_product_details logic if we adapt it or create a new func?
                            # Actually, get_product_details had logic for Composition Table and Uses Table which works for Formulado page!
                            # But it lacked the Input parsing for Dates.
                            # So: prod_details uses the NEW Input/Ajax logic.
                            # We need a helper for the OLD table logic for Formulados.
                            form_details = get_formulado_details(session, form_url_suffix) if form_url_suffix else {}
                            
                            # 7. Merge
                            final_manuf = prod_details.get('manufacturer') or manufacturer
                            
                            item = {
                                "id": reg_num, 
                                "dbId": prod_id, 
                                "name": name,
                                "manufacturer": final_manuf,
                                "titular": manufacturer,
                                "authCode": reg_num,
                                "category": "Medios Defensa Fitosanitaria",
                                "subtype": prod_details.get('subtype') or form_details.get('subtype') or 'Fitosanitario',
                                # Prefer Formulado composition (table) over Product (ajax/text)?
                                # Formulado page usually has the nice table with percentages.
                                "composition": form_details.get('composition') or prod_details.get('composition') or '',
                                "inscriptionDate": prod_details.get('inscriptionDate', '-'),
                                "expiryDate": prod_details.get('expiryDate', '-'),
                                "observations": prod_details.get('observations', ''),
                                # Crops/Pests come from Formulado page
                                "crops": form_details.get('crops', []),
                                "pests": form_details.get('pests', []),
                                "uses": form_details.get('uses', []),
                                "status": status_text,
                                "url": f"{URL_BASE}{prod_url_suffix}" if prod_url_suffix else "",
                                "catalogType": "Fitosanitarios (MAPA)"
                            }
                            
                            page_products.append(item)
                            
                        except Exception as e:
                            # print(f"Row error: {e}")
                            continue

                # PAGINATION CHECK
                if not page_products:
                    print("No products extracted on this page.")
                    if page > 500: break # Safety
                else:
                    # Check if we are seeing the same data as before?
                    # Simple check: compare first ID
                    if len(all_products) > 0 and page_products[0]['id'] == all_products[0]['id']:
                        print("!! Detected Pagination Loop (Same data as start). Server ignoring page param?")
                        # If page 2 == page 1, we are stuck.
                        # Try brute force URL? No, it's AJAX.
                        # Maybe 'page' param IS correct but session state issues?
                        # Let's try 'page' AND 'productosGrid-page' next time if this fails.
                        break
                        
                    # Also check against the immediately preceding page unique IDs?
                    # For now, just append.
                    pass

                all_products.extend(page_products)
                print(f"  -> Total Collected: {len(all_products)}")
                
                # Save incrementally
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(all_products, f, indent=2, ensure_ascii=False)
                
                page += 1
                
            except Exception as e:
                print(f"Error fetching page {page}: {e}")
                break
                
                # Save
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(all_products, f, indent=2, ensure_ascii=False)
                
                page += 1
                
            except Exception as e:
                print(f"Error fetching page {page}: {e}")
                break
        
        print(f"Scraping complete. Total products: {len(all_products)}")
            
    except Exception as e:
        print(f"Critical Error: {e}")

if __name__ == "__main__":
    scrape_fitos()
