import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re

URL_BASE = "https://servicio.mapa.gob.es/regfertiwai/"
URL_CONSULTA = URL_BASE + "ConsultaFertilizante.aspx"
URL_PROCESO = URL_BASE + "Proceso.aspx?f=2"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

OUTPUT_FILE = "src/data/fertilizers_detailed_scraped.json"

def get_text_clean(element):
    if element:
        return element.get_text(strip=True)
    return ""

def get_manufacturers(session):
    print("Fetching manufacturers list...")
    try:
        response = session.get(URL_CONSULTA, headers=HEADERS)
        soup = BeautifulSoup(response.content, "html.parser")
        select = soup.find("select", {"id": "EDAABA"})
        
        if not select:
            print("Error: Manufacturer select not found.")
            return []
            
        options = select.find_all("option")
        manufacturers = []
        for opt in options:
            val = opt.get("value")
            name = opt.get_text(strip=True)
            if val and val != "-1" and val.strip():
                manufacturers.append((val, name))
        
        print(f"Found {len(manufacturers)} manufacturers.")
        return manufacturers
    except Exception as e:
        print(f"Error fetching manufacturers: {e}")
        return []

def parse_detail_page(html_content, product_basic_info):
    soup = BeautifulSoup(html_content, "html.parser")
    data = product_basic_info.copy()
    
    # Initialize sections
    data["general_info"] = {}
    data["raw_materials"] = []
    data["presentation"] = {}
    data["nutrients"] = []
    data["other_characteristics"] = {}
    data["heavy_metals"] = {}
    data["microorganisms"] = {}
    data["hazards"] = []
    
    tables = soup.find_all("table", class_="data-table")
    
    for table in tables:
        caption = table.find("caption")
        caption_text = get_text_clean(caption) if caption else ""
        
        # 1. General Info
        if "Datos generales" in caption_text:
            rows = table.find_all("tr")
            for row in rows:
                cols = row.find_all(["td", "th"])
                if len(cols) == 2:
                    key = get_text_clean(cols[0])
                    val = get_text_clean(cols[1])
                    if "registro" in key.lower(): data["general_info"]["registration_number"] = val
                    elif "nombre" in key.lower(): data["general_info"]["commercial_name"] = val
                    elif "tipo" in key.lower(): data["general_info"]["product_type"] = val
                    elif "fabricante" in key.lower(): data["general_info"]["manufacturer"] = val

        # 2. Materias Primas
        elif "Materias primas" in caption_text:
            rows = table.find_all("tr")
            # Skip header row(s)
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 3:
                     # Check if it's a data row
                    desc = get_text_clean(cols[0])
                    code = get_text_clean(cols[1])
                    perc = get_text_clean(cols[2])
                    if desc and code:
                        data["raw_materials"].append({
                            "description": desc,
                            "code": code,
                            "percentage": perc
                        })
                    # Check for boolean flags (bottom rows usually)
                    if len(cols) == 2 or (len(cols) == 3 and not code):
                        # Example: "Los subproductos ... : Si"
                        text = get_text_clean(cols[0])
                        val = get_text_clean(cols[-1]) # Last column usually has value
                        if text and len(text) > 10:
                             data["other_characteristics"][text] = val

        # 3. Presentacion
        elif "Forma de presentación" in caption_text:
             rows = table.find_all("tr")
             for row in rows:
                cols = row.find_all("td")
                if len(cols) == 2:
                    key = get_text_clean(cols[0])
                    val = get_text_clean(cols[1])
                    if "presentación" in key.lower(): data["presentation"]["form"] = val
                    elif "empleo" in key.lower(): data["presentation"]["mode"] = val
                    elif "envasado" in key.lower(): data["presentation"]["packaging"] = val

        # 4. Nutrientes
        elif "Contenido en nutrientes" in caption_text:
            rows = table.find_all("tr")
            current_section = "Main" # Main, Secondary, Micronutrients
            for row in rows:
                # Check for section headers
                if row.find("th"): continue # Skip main headers
                
                cols = row.find_all("td")
                if len(cols) == 1 or (len(cols) > 1 and "ELEMENTOS" in get_text_clean(cols[0])):
                     section_header = get_text_clean(cols[0])
                     if "SECUNDARIOS" in section_header: current_section = "Secondary"
                     elif "MICRONUTRIENTES" in section_header: current_section = "Micronutrients"
                     continue
                
                if len(cols) >= 2:
                    name = get_text_clean(cols[0])
                    total = get_text_clean(cols[1])
                    # Depending on table layout, other cols might consist of soluble, chelated etc
                    soluble = get_text_clean(cols[2]) if len(cols) > 2 else "-"
                    chelated = get_text_clean(cols[3]) if len(cols) > 3 else "-"
                    
                    if name and name != "-":
                         data["nutrients"].append({
                             "type": current_section,
                             "name": name,
                             "total": total,
                             "soluble": soluble,
                             "chelated": chelated
                         })

        # 5. Otras caracteristicas
        elif "Otras caracteristicas" in caption_text:
             rows = table.find_all("tr")
             for row in rows:
                cols = row.find_all("td")
                if len(cols) == 2:
                    key = get_text_clean(cols[0])
                    val = get_text_clean(cols[1])
                    data["other_characteristics"][key] = val

        # 6. Metales pesados
        elif "Metales pesados" in caption_text:
             rows = table.find_all("tr")
             for row in rows:
                cols = row.find_all("td")
                if len(cols) == 2:
                    key = get_text_clean(cols[0])
                    val = get_text_clean(cols[1])
                    data["heavy_metals"][key] = val

        # 7. Microorganisms
        elif "Presencia de microorganismos" in caption_text:
             rows = table.find_all("tr")
             # This table structure is a bit weird (merged cells)
             # Simplification: grab text
             row_texts = [get_text_clean(r) for r in rows if r.find("td")]
             # Basic extraction
             for row in rows:
                 cols = row.find_all("td")
                 if len(cols) == 2:
                      data["microorganisms"][get_text_clean(cols[0])] = get_text_clean(cols[1])

        # 8. Peligrosidad
        elif "Clasificación de peligrosidad" in caption_text:
            rows = table.find_all("tr")
            for row in rows:
                 data["hazards"].append(get_text_clean(row))

    return data

def scrape_all():
    session = requests.Session()
    session.headers.update(HEADERS)
    
    manufacturers = get_manufacturers(session)
    all_products_detailed = []
    
    # For testing/demo, maybe limit manufactures or allow user invalidation?
    # The user asked for "Busque nuevamente ... extraiga toda la informacion"
    # To be practical, let's start with a few manufacturers or all but handle interruptions
    
    print(f"Starting detailed scraping for {len(manufacturers)} manufacturers...")
    
    for i, (mid, mname) in enumerate(manufacturers):
        print(f"[{i+1}/{len(manufacturers)}] Processing Manufacturer: {mname}")
        
        try:
            # Get list
            payload = { "CB_Fabricante1": mid }
            resp = session.post(URL_PROCESO, data=payload)
            soup = BeautifulSoup(resp.content, "html.parser")
            
            # Find list table
            tables = soup.find_all("table")
            if not tables:
                print("  No tables found.")
                continue
                
            # Assume largest table is products
            tables.sort(key=lambda t: len(t.find_all("tr")), reverse=True)
            list_table = tables[0]
            rows = list_table.find_all("tr")
            
            products_found = 0
            for row in rows:
                cols = row.find_all("td")
                if len(cols) < 3: continue
                
                # Try to find link in first columns
                link_elem = None
                code_text = ""
                name_text = ""
                
                # Usually col 0 has code with link
                if cols[0].find("a"):
                    link_elem = cols[0].find("a")
                    code_text = get_text_clean(link_elem)
                else:
                    code_text = get_text_clean(cols[0])
                
                if len(cols) > 2:
                     # col 1 is Type, col 2 is Name usually?
                     # Based on debug: Col 0: Code, Col 1: Type, Col 2: Name
                     name_text = get_text_clean(cols[2])
                     
                     # Or check previous debug:
                     # Headers: ['Código', 'Tipo', 'Nombre comercial', 'Fabricante', 'F. de registro'] (Table 0)
                     # So Name is col 2.
                
                if link_elem:
                    href = link_elem.get("href")
                    # href is "DetalleFertilizante.aspx?clave=XXXX"
                    if "DetalleFertilizante.aspx" in href:
                        detail_url = URL_BASE + href
                        
                        # Basic info from list
                        basic_info = {
                            "id": code_text,
                            "name": name_text,
                            "manufacturer": mname,
                            "detail_url": detail_url
                        }
                        
                        # Fetch Detail
                        # print(f"    Fetching details for {code_text}...")
                        try:
                           resp_detail = session.get(detail_url)
                           if resp_detail.status_code == 200:
                               detailed_data = parse_detail_page(resp_detail.content, basic_info)
                               all_products_detailed.append(detailed_data)
                               products_found += 1
                           else:
                               print(f"    Error fetching detail {detail_url}: {resp_detail.status_code}")
                        except Exception as e:
                            print(f"    Exception fetching detail: {e}")
                        
                        # Be kind to server
                        # time.sleep(0.1) 
            
            print(f"  -> Extracted {products_found} products.")
            
            # Incremental save
            if products_found > 0:
                 with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(all_products_detailed, f, indent=2, ensure_ascii=False)
                    
        except Exception as e:
            print(f"Error processing manufacturer {mname}: {e}")

    print(f"Completed! Total products scraped: {len(all_products_detailed)}")
    print(f"Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    if not os.path.exists("src/data"):
        os.makedirs("src/data")
    scrape_all()
