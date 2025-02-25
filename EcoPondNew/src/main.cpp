#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

// WiFi Credentials
#define WIFI_SSID "Infinix NOTE 7 Lite"
#define WIFI_PASSWORD "123456789"

// Firebase Credentials
#define API_KEY "AIzaSyDvoNTfgTCUj1k729S9SJerlOMWILV3dFs"
#define DATABASE_URL "https://ecopond-86c76-default-rtdb.europe-west1.firebasedatabase.app/"
#define USER_EMAIL "xanthaprojects@gmail.com"
#define USER_PASSWORD "#Asa_wav01!"

// Sensor Pins
#define TRIGGER_PIN  5   // Ultrasonic Trigger
#define ECHO_PIN     18  // Ultrasonic Echo
#define SOUND_SPEED  0.034  // Sound speed in cm/µs
#define DS18B20_PIN  4   // OneWire Temperature Sensor
#define MQ135_PIN    34  // Air Quality Sensor (Analog)
#define TURBIDITY_PIN 35 // Turbidity Sensor (Analog)
#define TDS_PIN      32  // TDS Sensor (Analog)

// Pump and Motor Pins
#define DRAIN_PUMP_RELAY 15  // Refill Pump
#define Feedermotor  2   // Drain Pump

// Water Tank Constants
#define maxheight   18
#define tankheight  22

// Firebase Objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0;

// DS18B20 Temperature Sensor Setup
OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.print("\nConnected with IP: ");
  Serial.println(WiFi.localIP());

  // Configure Firebase
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;

  Firebase.reconnectNetwork(true);
  fbdo.setBSSLBufferSize(4096, 1024);
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);
  config.timeout.serverResponse = 10 * 1000;

  // Initialize Sensors
  sensors.begin();
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Set Pump & Motor as Outputs
  pinMode(DRAIN_PUMP_RELAY, OUTPUT);
  pinMode(Feedermotor, OUTPUT);

  // Default all Relays OFF
  digitalWrite(DRAIN_PUMP_RELAY, HIGH);
  digitalWrite(Feedermotor, HIGH);
}

void loop() {
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 10000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Read DS18B20 Temperature
    sensors.requestTemperatures();
    float temperature = sensors.getTempCByIndex(0);

    // Read Ultrasonic Water Level
    digitalWrite(TRIGGER_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIGGER_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIGGER_PIN, LOW);

    long duration = pulseInLong(ECHO_PIN, HIGH);
    int distance = (duration * SOUND_SPEED) / 2;
    int waterlevel = tankheight - distance;
    int waterlevelpercent = map(waterlevel, 0, maxheight, 0, 100);

    // Read Analog Sensor Values
    int mq135Raw = analogRead(MQ135_PIN);
    float airQuality = map(mq135Raw, 0, 4095, 0, 100);

    int turbidityRaw = analogRead(TURBIDITY_PIN);
    float turbidityPercent = map(turbidityRaw, 0, 3000, 0, 100);

    int tdsRaw = analogRead(TDS_PIN);
    float tds = map(tdsRaw, 0, 4095, 0, 1000);

    // Print Data
    Serial.print("Temperature: "); Serial.print(temperature); Serial.print(" °C | ");
    Serial.print("Air Quality: "); Serial.print(airQuality); Serial.print(" % | ");
    Serial.print("Turbidity: "); Serial.print(turbidityPercent); Serial.print(" % | ");
    Serial.print("TDS: "); Serial.print(tds); Serial.print(" ppm | ");
    Serial.print("Water Level: "); Serial.print(waterlevel); Serial.print(" cm | ");
    Serial.print("Water Level Percent: "); Serial.print(waterlevelpercent); Serial.println(" %");

    // Send Sensor Data to Firebase
    Firebase.RTDB.setFloat(&fbdo, F("/sensorData/temperature"), temperature);
    Firebase.RTDB.setFloat(&fbdo, F("/sensorData/airQuality"), airQuality);
    Firebase.RTDB.setFloat(&fbdo, F("/sensorData/turbidity"), turbidityPercent);
    Firebase.RTDB.setFloat(&fbdo, F("/sensorData/tds"), tds);
    Firebase.RTDB.setInt(&fbdo, F("/sensorData/waterLevel"), waterlevel);
    Firebase.RTDB.setInt(&fbdo, F("/sensorData/waterLevelPercent"), waterlevelpercent);

    // --- Read Control Values from Firebase ---
    int drainValue, feedingValue, refillValue;

    if (Firebase.RTDB.getInt(&fbdo, F("/ControlNodes/Drain"))) {
      drainValue = fbdo.to<int>();
    } else {
      drainValue = 0;
    }

    if (Firebase.RTDB.getInt(&fbdo, F("/ControlNodes/Feeding"))) {
      feedingValue = fbdo.to<int>();
    } else {
      feedingValue = 0;
    }

    if (Firebase.RTDB.getInt(&fbdo, F("/ControlNodes/Refill"))) {
      refillValue = fbdo.to<int>();
    } else {
      refillValue = 0;
    }

    // Print Control Values
    Serial.print("Drain: "); Serial.print(drainValue);
    Serial.print(" | Feeding: "); Serial.print(feedingValue);
    Serial.print(" | Refill: "); Serial.println(refillValue);

    // --- Control Pump & Motor ---
    digitalWrite(DRAIN_PUMP_RELAY, drainValue == 1 ? LOW : HIGH);
    digitalWrite(Feedermotor, refillValue == 1 ? LOW : HIGH);

    if (tds > 300 || temperature > 33 || airQuality > 50 || turbidityPercent > 320) {
      refill();
    }

  }
}

void refill(){
  Serial.print("refilling");
}
