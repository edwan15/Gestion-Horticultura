
import requests
import time

URL_GRID = "https://servicio.mapa.gob.es/regfiweb/Productos/ProductosGrid"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://servicio.mapa.gob.es/regfiweb/Productos/Index"
}

def debug_products_grid():
    session = requests.Session()
    session.headers.update(HEADERS)
    
    # Init session
    session.get("https://servicio.mapa.gob.es/regfiweb/Home/Inicio")
    
    print("Fetching ProductosGrid...")
    params = { "_": int(time.time() * 1000), "page": 1, "rows": 10 }
    
    resp = session.get(URL_GRID, params=params)
    print(f"Status: {resp.status_code}")
    
    with open("debug_productos_grid.html", "w", encoding="utf-8") as f:
        f.write(resp.text)
    print("Saved debug_productos_grid.html")

if __name__ == "__main__":
    debug_products_grid()
