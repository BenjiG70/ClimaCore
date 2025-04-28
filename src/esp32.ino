// zu installierende Bibliotheken:
// DHT sensor library by Adafruit
// ESP32-Tutorial: https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/

#include "secrets.h"

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <WiFi.h>

#define DHTPIN 2

#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// Definieren der Server-Base URL 
const char* baseURL = DATABASE_SERVER;

// Sensornamen definieren
const char* sensorName = "test";

// Definieren der LED-Pin
const int led = 3;

void setup() {

  // put your setup code here, to run once:
  Serial.begin(9600);

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
  delay(2000);
  // überprüfue, ob der ESP mit dem W-LAN verbunden ist
  if (WiFi.status() == WL_CONNECTED) { // Prüfen, ob WLAN verbunden ist
    HTTPClient http;
  // Überprüfen, ob eine neue Karte in Reichweite ist
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }
  // put your main code here, to run repeatedly:

  // Abfragen der Sensorwerte
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Wenn temperatur oder luftfeuchte keine nummer ist
  if(isnan(humidity) || isnan(temperature)){
    errorBlink();
    Serial.println("Fehler beim Auslesen des Sensors");
    return;
  }
  // baue den Json-Body für die spätere POST-Anfrage (CRUD)
  String jsonPayload = "{ \"sensor\":" + String(sensorName) +   
                       ", \"temperature\" : " + String(temperature) + 
                       ", \"humidity\" : " + String(humidity) + "}"
  String url = String(baseURL) + "/insert/data";


  http.begin(wifiClient, url); // Verbindung zur URL herstellen
  http.addHeader("Content-Type", "application/json");

  // GET-Anfrage senden
  int httpResponseCode = http.POST(jsonPayload); 

  // Wenn Antwort erfolgreich empfangen
  if (httpResponseCode > 0) {
    successBlink();
    // Antwort als String lesen
    String response = http.getString(); 
    erial.println("HTTP-Antwort:");
    Serial.println(response);
  } else {
    errorBlink();
    Serial.print("Fehler bei der Anfrage: ");
    Serial.println(httpResponseCode);

  }
  // Verbindung schließen
  http.end(); 

  //Ausgabe der Temperatur und Luftfeuchte
  Serial.println("------------------------------------");
  Serial.println("Auslesen erfolgreich!");
  Serial.print("Temperatur: ");
  Serial.print(temperature);
  Serial.print(" °C ");
  Serial.println("Luftfeuchte: ");
  Serial.print(humidity);
  Serial.print(" % ");
  Serial.println("Ausgabe erfolgreich!");
  Serial.println("------------------------------------");

}

void errorBlink(){
  digitalWrite(led, LOW);
  delay(400);
  digitalWrite(led, HIGH);
  delay(400);
  digitalWrite(led, LOW);
  delay(400);
  digitalWrite(led, HIGH);
}
void successBlink(){
  digitalWrite(led, LOW);
  delay(400);
  digitalWrite(led, HIGH);
}