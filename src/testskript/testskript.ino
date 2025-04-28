
#include <Adafruit_NeoPixel.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// WLAN-Zugangsdaten
const char* ssid = "SSID";         // Name/SSID des WLANs
const char* password = "PASSWORT"; // Passwort des WLANs

// URL der Website
const char* baseURL = "http://127.0.0.1"; // IP-Adresse

// Erstelle ein WiFiClient-Objekt
WiFiClient wifiClient;  

// Pin-Definitionen
#define LEDPIN        D1 //LED PIN

#define RST_PIN D3  // Reset-Pin (GPIO0)
#define SS_PIN D8   // SDA-Pin (GPIO15)

#define LEDCOUNT 8

Adafruit_Neopixel pixels(LEDCOUNT, LEDPIN, NEO_GRB + NEO_KHZ8000);

MFRC522 rfid(SS_PIN, RST_PIN); // Initialisiere MFRC522-Objekt

void setup() {
  // Serielle Konsole starten
  Serial.begin(115200);
  while (!Serial);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());

  // SPI starten (Pins sind hardwaremäßig vorgegeben)
  SPI.begin();
  rfid.PCD_Init();
  pixels.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) { // Prüfen, ob WLAN verbunden ist
    HTTPClient http;
    pixels.clear();
  // Überprüfen, ob eine neue Karte in Reichweite ist
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }
  updateLoadingBar();
  // UID auslesen und auf der seriellen Konsole anzeigen
  uid = "{\"uid\":" + String(rfidReader0.uid.uidByte[0]) + " " + String(rfidReader0.uid.uidByte[1]) + " " + String(rfidReader0.uid.uidByte[2]) + " " + String(rfidReader0.uid.uidByte[3]) +"}";
    String url = String(baseURL) + "/check/uid";

    http.begin(wifiClient, url); // Verbindung zur URL herstellen
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.GET(); // GET-Anfrage senden

    if (httpResponseCode > 0) {
      // Antwort erfolgreich empfangen
      String response = http.getString(); // Antwort als String lesen
      Serial.println("HTTP-Antwort:");
      Serial.println(response);
    } else {
      Serial.print("Fehler bei der Anfrage: ");
      Serial.println(httpResponseCode);
    }

    http.end(); // Verbindung schließen
  } else {

  }



  // Gerät "freigeben" für den nächsten Lesevorgang
  rfid.PICC_HaltA();
}

// Funktion zur Steuerung der LED-Ladebalken-Animation
void updateLoadingBar() {
  unsigned long now = millis();

  // Aktualisierung nur nach Ablauf der Animation-Delay-Zeit
  if (now - lastUpdate >= animationDelay) {
    lastUpdate = now;

    // Aktuelle LED an und alle anderen aus
    strip.clear();
    strip.setPixelColor(currentLED, strip.Color(0, 0, 255)); // Blau
    strip.show();

    // Ladebalken-Animation vorwärts oder rückwärts
    if (forward) {
      currentLED++;
      if (currentLED >= NUM_LEDS) {
        currentLED = NUM_LEDS - 1;
        forward = false;
      }
    } else {
      currentLED--;
      if (currentLED < 0) {
        currentLED = 0;
        forward = true;
      }
    }
  }
}
