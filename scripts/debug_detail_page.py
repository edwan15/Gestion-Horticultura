
import requests

URL_DETAIL = "https://servicio.mapa.gob.es/regfiweb/Productos/DetalleProducto/96161"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    # Remove X-Requested-With for normal page load usually
    "Referer": "https://servicio.mapa.gob.es/regfiweb/Productos/Index"
}

def debug_detail():
    session = requests.Session()
    session.headers.update(HEADERS)
    
    print(f"Fetching {URL_DETAIL}...")
    resp = session.get(URL_DETAIL)
    
    with open("debug_product_detail.html", "w", encoding="utf-8") as f:
        f.write(resp.text)
    print("Saved debug_product_detail.html")

if __name__ == "__main__":
    debug_detail()
