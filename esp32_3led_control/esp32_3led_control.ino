#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

const char* WIFI_SSID = "ParaBot";
const char* WIFI_PASSWORD = "ashleywayligo";

// Pins
const int MOTION_PIN = 27;
const int DHT_PIN = 26;
const int SOUND_PIN = 34;
const int BUZZER_PIN = 25;
const int OLED_SDA = 21;
const int OLED_SCL = 22;

#define DHT_TYPE DHT11
#define OLED_WIDTH 128
#define OLED_HEIGHT 64
#define OLED_ADDRESS 0x3C  

DHT dht(DHT_PIN, DHT_TYPE);

Adafruit_SSD1306 display(
  OLED_WIDTH,
  OLED_HEIGHT,
  &Wire,
  -1
);

WebServer server(80);

bool motionDetected = false;
bool soundDetected = false;
bool alarmState = false;
bool oledConnected = false;

float temperature = 0;
float humidity = 0;

bool temperatureValid = false;

unsigned long lastSensorRead = 0;
const unsigned long SENSOR_INTERVAL = 2000;

void setCorsHeaders() {
  server.sendHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  server.sendHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );

  server.sendHeader(
    "Access-Control-Allow-Headers",
    "*"
  );
}

void showWelcomeScreen() {
  if (!oledConnected) return;

  display.clearDisplay();

  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  display.setCursor(24, 18);
  display.println("WELCOME HOME!");

  display.setCursor(30, 38);
  display.println("ESP32 SYSTEM");

  display.display();

  delay(3000);
}

void updateOLED() {
  if (!oledConnected) return;

  display.clearDisplay();

  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);

  display.setCursor(0, 0);
  display.println("HOME SECURITY");

  display.drawLine(
    0,
    9,
    127,
    9,
    SSD1306_WHITE
  );

  display.setCursor(0, 14);
  display.print("TEMP: ");

  if (temperatureValid) {
    display.print(temperature, 1);
    display.println(" F");
  } else {
    display.println("-- F");
  }

  display.setCursor(0, 25);
  display.print("HUM: ");

  if (temperatureValid) {
    display.print(humidity, 0);
    display.println("%");
  } else {
    display.println("--%");
  }

  display.setCursor(0, 36);
  display.print("MOTION: ");

  if (motionDetected) {
    display.println("TRIGGERED");
  } else {
    display.println("SAFE");
  }

  display.setCursor(0, 47);
  display.print("SOUND: ");

  if (soundDetected) {
    display.println("DETECTED");
  } else {
    display.println("SAFE");
  }

  display.setCursor(0, 58);
  display.print("ALARM: ");

  if (alarmState) {
    display.println("ON");
  } else {
    display.println("OFF");
  }

  display.display();
}

void readSensors() {
  motionDetected = digitalRead(MOTION_PIN);

  soundDetected = digitalRead(SOUND_PIN);

  float newTemperature =
    dht.readTemperature(true);

  float newHumidity =
    dht.readHumidity();

  if (
    !isnan(newTemperature) &&
    !isnan(newHumidity)
  ) {
    temperature = newTemperature;
    humidity = newHumidity;
    temperatureValid = true;
  } else {
    temperatureValid = false;
  }

  updateOLED();
}

void setAlarm(bool state) {
  alarmState = state;

  digitalWrite(
    BUZZER_PIN,
    alarmState ? HIGH : LOW
  );

  updateOLED();
}

void handleRoot() {
  setCorsHeaders();

  String html = "<!DOCTYPE html>";
  html += "<html>";
  html += "<head>";
  html += "<title>ESP32 Home Security</title>";
  html += "</head>";
  html += "<body>";

  html += "<h1>ESP32 HOME SECURITY SYSTEM</h1>";

  html += "<p>Motion: ";
  html += motionDetected ? "TRIGGERED" : "SAFE";
  html += "</p>";

  html += "<p>Temperature: ";

  if (temperatureValid) {
    html += String(temperature, 1);
    html += " F";
  } else {
    html += "--";
  }

  html += "</p>";

  html += "<p>Humidity: ";

  if (temperatureValid) {
    html += String(humidity, 0);
    html += "%";
  } else {
    html += "--";
  }

  html += "</p>";

  html += "<p>Sound: ";
  html += soundDetected ? "DETECTED" : "SAFE";
  html += "</p>";

  html += "<p>Alarm: ";
  html += alarmState ? "ON" : "OFF";
  html += "</p>";

  html += "</body>";
  html += "</html>";

  server.send(
    200,
    "text/html",
    html
  );
}

void handleStatus() {
  setCorsHeaders();

  String json = "{";

  json += "\"motion\":";
  json += motionDetected ? "true" : "false";

  json += ",\"sound\":";
  json += soundDetected ? "true" : "false";

  json += ",\"temperature\":";

  if (temperatureValid) {
    json += String(temperature, 1);
  } else {
    json += "null";
  }

  json += ",\"humidity\":";

  if (temperatureValid) {
    json += String(humidity, 0);
  } else {
    json += "null";
  }

  json += ",\"alarm\":";
  json += alarmState ? "true" : "false";

  json += ",\"oled\":";
  json += oledConnected ? "true" : "false";

  json += "}";

  server.send(
    200,
    "application/json",
    json
  );
}

void handleAlarmRoute() {
  setCorsHeaders();

  String uri = server.uri();

  if (uri == "/alarm/on") {
    setAlarm(true);

    server.send(
      200,
      "text/plain",
      "Alarm ON"
    );

    return;
  }

  if (uri == "/alarm/off") {
    setAlarm(false);

    server.send(
      200,
      "text/plain",
      "Alarm OFF"
    );

    return;
  }

  server.send(
    404,
    "text/plain",
    "Unknown alarm action"
  );
}

void handleOptions() {
  setCorsHeaders();
  server.send(204);
}

void setup() {
  Serial.begin(115200);

  pinMode(
    MOTION_PIN,
    INPUT
  );

  pinMode(
    SOUND_PIN,
    INPUT
  );

  pinMode(
    BUZZER_PIN,
    OUTPUT
  );

  digitalWrite(
    BUZZER_PIN,
    LOW
  );

  dht.begin();

  Wire.begin(
    OLED_SDA,
    OLED_SCL
  );

  if (
    display.begin(
      SSD1306_SWITCHCAPVCC,
      OLED_ADDRESS
    )
  ) {
    oledConnected = true;

    showWelcomeScreen();
  }

  WiFi.begin(
    WIFI_SSID,
    WIFI_PASSWORD
  );

  int attempts = 0;

  while (
    WiFi.status() != WL_CONNECTED &&
    attempts < 30
  ) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (
    WiFi.status() != WL_CONNECTED
  ) {
    Serial.println();
    Serial.println("WiFi connection failed.");
    return;
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  server.on(
    "/",
    HTTP_GET,
    handleRoot
  );

  server.on(
    "/status",
    HTTP_GET,
    handleStatus
  );

  server.on(
    "/alarm/on",
    HTTP_GET,
    handleAlarmRoute
  );

  server.on(
    "/alarm/off",
    HTTP_GET,
    handleAlarmRoute
  );

  server.on(
    "/status",
    HTTP_OPTIONS,
    handleOptions
  );

  server.onNotFound([]() {
    if (
      server.method() == HTTP_OPTIONS
    ) {
      handleOptions();
      return;
    }

    setCorsHeaders();

    server.send(
      404,
      "text/plain",
      "Not found"
    );
  });

  server.begin();

  readSensors();
}

void loop() {
  server.handleClient();

  if (
    millis() - lastSensorRead >=
    SENSOR_INTERVAL
  ) {
    lastSensorRead = millis();

    readSensors();
  }
}