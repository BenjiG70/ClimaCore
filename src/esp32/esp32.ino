// zu installierende Bibliotheken:
// DHT sensor library by Adafruit
// ESP32-Tutorial: https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/

#include "secrets.h"

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <WiFi.h>
#include <HTTPClient.h>

#define DHTPIN 25

#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Definieren der Server-Base URL
const char* baseURL = DATABASE_SERVER;

// Sensornamen definieren
const char* sensorName = "MDR-Turm";

// Definieren der LED-Pin
const int led = 26;

void setup() {

  // put your setup code here, to run once:
  Serial.begin(115200);

  // starte den Sensor
  dht.begin();

  // starte die Netzwerkkopplung
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());

  // initialisieren der LED(s)
  pinMode(led, OUTPUT);
}

void loop() {
  digitalWrite(led, HIGH);
  delay(1000);
  digitalWrite(led, LOW);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient wifiClient;

    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();

    if (isnan(humidity) || isnan(temperature)) {
      Serial.println("Fehler beim Auslesen des Sensors");
      return;
    }

    String jsonPayload = "{ \"sensor\": \"" + String(sensorName) + "\"" + ", \"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + ", \"air_pressure\": " + NULL + " }";
    String url = String(baseURL) + "/insert/data/";

    http.begin(wifiClient, url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP-Antwort:");
      Serial.println(response);
    } else {
      Serial.print("Fehler bei der Anfrage: ");
      Serial.println(httpResponseCode);
    }

    http.end();

    Serial.println("------------------------------------");
    Serial.println("Auslesen erfolgreich!");
    Serial.print("Temperatur: ");
    Serial.print(temperature);
    Serial.println(" °C ");
    Serial.print("Luftfeuchte: ");
    Serial.print(humidity);
    Serial.println(" % ");
    Serial.println("Ausgabe erfolgreich!");
    Serial.println("------------------------------------");
  }
  delay(900000);
}