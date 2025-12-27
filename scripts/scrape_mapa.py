import requests
from bs4 import BeautifulSoup
import json
import time

URL = "https://servicio.mapa.gob.es/regfertiwai/ConsultaFertilizante.aspx"
RESULTS_URL = "https://servicio.mapa.gob.es/regfertiwai/Proceso.aspx?f=2"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
OUTPUT_FILE = "src/data/mapa_fertilizers_scraped.json"

def get_manufacturers(session):
    print("Fetching main page to get manufacturers list...")
    try:
        response = session.get(URL, headers=HEADERS)
        soup = BeautifulSoup(response.content, "html.parser")
        
        select = soup.find("select", {"id": "EDAABA"}) 
        if not select:
            print("Error: Could not find manufacturer select (EDAABA).")
            return []
        
        options = select.find_all("option")
        manufacturers = []
        for opt in options:
            val = opt.get("value")
            name = opt.get_text(strip=True)
            if val and val != "-1": 
                 manufacturers.append((val, name))
                 
        print(f"Found {len(manufacturers)} manufacturers.")
        return manufacturers
    except Exception as e:
        print(f"Error fetching manufacturers: {e}")
        return []

def scrape_products_for_manufacturer(session, manuf_id, manuf_name):
    payload = { "CB_Fabricante1": manuf_id }
    try:
        response = session.post(RESULTS_URL, data=payload, headers=HEADERS)
        soup = BeautifulSoup(response.content, "html.parser")
        tables = soup.find_all("table")
        products = []
        
        if tables:
            tables.sort(key=lambda t: len(t.find_all("tr")), reverse=True)
            main_table = tables[0]
            rows = main_table.find_all("tr")
            
            if len(rows) > 1:
                for row in rows[1:]:
                    cols = row.find_all("td")
                    if len(cols) >= 3:
                        col_id_raw = cols[0].get_text(strip=True)
                        col_name = cols[1].get_text(strip=True)
                        col_manuf = cols[2].get_text(strip=True) if len(cols) > 2 else manuf_name

                        if col_id_raw == "Código" or col_name == "Tipo":
                            continue

                        if col_name and len(col_name) > 1:
                            products.append({
                                "id": col_id_raw,
                                "name": col_name,
                                "manufacturer": col_manuf, 
                                "authCode": col_id_raw,
                                "category": "Fertilizantes",
                                "subtype": "-",
                                "composition": "Consultar Ficha",
                                "catalogType": "Fertilizantes (MAPA/Público)"
                            })
        return products
    except Exception as e:
        print(f"Error scraping manufacturer {manuf_id}: {e}")
        return []

def scrape_all():
    session = requests.Session()
    # Initialize with existing data if possible, or empty?
    # Better to start empty to ensure clean state, or read existing?
    # User said they had 6. Let's overwrite to clean up.
    all_products = [] 
    
    manufs = get_manufacturers(session)
    
    print(f"Starting scraping of {len(manufs)} manufacturers...")
    
    for i, (mid, mname) in enumerate(manufs):
        # Log progress
        print(f"[{i+1}/{len(manufs)}] Scraping: {mname}")
            
        prods = scrape_products_for_manufacturer(session, mid, mname)
        if prods:
            print(f"   -> Found {len(prods)} items.")
            all_products.extend(prods)
            
            # Save EVERY successful batch to disk so user sees immediate results
            try:
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump(all_products, f, indent=2, ensure_ascii=False)
            except Exception as e:
                print(f"Error writing file: {e}")
                
        # Small delay to be polite
        # time.sleep(0.05)
        
    return all_products

if __name__ == "__main__":
    scrape_all()
