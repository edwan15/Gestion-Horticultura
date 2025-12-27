
import requests
from bs4 import BeautifulSoup
import time
import json

URL_HOME = "https://servicio.mapa.gob.es/regfiweb/Home/Inicio"
URL_GRID = "https://servicio.mapa.gob.es/regfiweb/Formulados/FormuladosGrid"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest", 
    "Referer": "https://servicio.mapa.gob.es/regfiweb/Formulados/Index"
}

def debug_grid():
    session = requests.Session()
    session.headers.update(HEADERS)
    session.get(URL_HOME)
    
    print("Fetching one page of grid for debugging...")
    params = { "_": int(time.time() * 1000), "page": 1, "rows": 10 }
    resp = session.get(URL_GRID, params=params)
    
    with open("debug_grid_content.html", "w", encoding="utf-8") as f:
        f.write(resp.text)
    print("Saved debug_grid_content.html")

if __name__ == "__main__":
    debug_grid()
