import requests
import random
import time
from datetime import datetime, timedelta

# Basis-URL der API (ersetzen Sie "http://localhost:3000" durch Ihre Server-URL)
url = 'http://<ip>:<port>/insert/data'

# Funktion, die ein zufälliges Datum innerhalb des letzten Jahres bis heute als Unix-Timestamp erstellt
def generate_random_timestamp():
    start_date = datetime.now() - timedelta(days=365)  # Vor einem Jahr
    end_date = datetime.now()
    random_date = start_date + (end_date - start_date) * random.random()
    return int(random_date.timestamp())  # Unix-Timestamp als Ganzzahl zurückgeben

# Generiere und sende 100 Datensätze
for _ in range(100):
    data = {
        "temperature": round(random.uniform(-10, 30), 2),  # Zufällige Temperatur zwischen -10°C und 30°C
        "humidity": round(random.uniform(0, 100), 2),      # Luftfeuchtigkeit zwischen 0% und 100%
        "air_pressure": round(random.uniform(950, 1050), 2), # Luftdruck zwischen 950 und 1050 hPa
        "sensor": f"sensor_2", #{random.randint(1, 10)}       # Sensorname z.B. sensor_1 bis sensor_10
        "date_time": generate_random_timestamp()           # Zufälliges Datum als Unix-Timestamp
    }
    
    # POST-Anfrage an den API-Endpunkt
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        print(f"Datensatz eingefügt: {data}")
    else:
        print(f"Fehler beim Einfügen: {response.status_code}, {response.text}")
