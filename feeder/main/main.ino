/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp32-date-time-ntp-client-server-arduino/
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

/*
  ArduinoJson - arduinojson.org
  Copyright Benoit Blanchon 2014-2019
  MIT License
*/

#include <WiFi.h>
#include <WiFiClient.h>
#include <Motor.h>
#include <HX711.h>
#include <ArduinoJson.h>
#include <Distance.h>
#include "time.h"

const char* ssid = "iPhone123";
const char* password = "12345678";
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600;
const int daylightOffset_sec = 3600;
const char* serverAddress = "172.20.10.3";
const int serverPort = 3000;

// Motor pins
const int enPin = 9;   // Enable pin
const int in1Pin = 8;  // Input 1
const int in2Pin = 7;  // Input 2
Motor motor(enPin, in1Pin, in2Pin);

// Distance sensor pins
const int trigPin = 2;
const int echoPin = 3;
Distance distance(trigPin, echoPin);

// Load cell pins
const int doutPin = 4;
const int sckPin = 5;
const float calibrationFactor = -1100;
HX711 scale;

void setup() {
  Serial.begin(115200);
  motor.initMotor();
  scale.begin(doutPin, sckPin);
  scale.set_scale(calibrationFactor);
  scale.tare();
  distance.init();
  connectToWifi(ssid, password);
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void connectToWifi(const char* ssid, const char* pass) {
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void getRequest(WiFiClient client, const char* resourceToGet) {
  String request = "GET " + String(resourceToGet) + " HTTP/1.1\r\nHost: " + serverAddress + "\r\nConnection: close\r\n\r\n";
  client.print(request);
}


  void moveRotorToOpen(bool open, int delay) {
  Motor.startMotor(open);
  Motor.speed(250);
  delay(delay);
  Motor.stopMotor();
}



bool connectToServer(WiFiClient &client) {
  if (!client.connect(serverAddress, serverPort)) {
    Serial.println("Failed to connect to server");
    return false;
  }
  return true;
}

void fetchSchedules(WiFiClient &client) {
  getRequest(client, "/getschedules");
  Serial.println("Waiting for response...");

  char status[32] = {0};
  client.readBytesUntil('\r', status, sizeof(status));
  if (strcmp(status + 9, "200 OK") != 0) {
    Serial.print(F("Unexpected response: "));
    Serial.println(status);
    return;
  }

  char endOfHeaders[] = "\r\n\r\n";
  if (!client.find(endOfHeaders)) {
    Serial.println(F("Invalid response"));
    return;
  }

  DynamicJsonDocument doc(200);
  DeserializationError error = deserializeJson(doc, client);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
}

bool isScheduledTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return false;
  }

  int scheduledMonth = doc["month"];
  int scheduledDay = doc["day"];
  int scheduledHour = doc["hour"];
  int scheduledMinute = doc["minute"];

  return (scheduledMonth == timeinfo.tm_mon && scheduledDay == timeinfo.tm_mday && scheduledHour == timeinfo.tm_hour && scheduledMinute == timeinfo.tm_min);
}

void executeScheduledActions(WiFiClient &client) {
  Serial.println("Start MOTOR");
  getRequest(client, "/removeSchedule");
  for (int i = 0; i < 5; i++) {
    moveRotorToOpen(true, 500);
    delay(100);
    moveRotorToOpen(false, 600);
  }
}

void sendSensorData(WiFiClient &client, int distanceValue, float weight) {
  Serial.print(distanceValue);
  Serial.println("cm");

  String data = "{\"dist\": " + String(distanceValue) + ",\"weight\": " + String(weight) + "}";
  String request = "POST /uploadDistanceSensorValue HTTP/1.1\r\nHost: " + String(serverAddress) + ":" + String(serverPort) + "\r\nContent-Type: application/json\r\nContent-Length: " + String(data.length()) + "\r\nConnection: close\r\n\r\n" + data;
  client.print(request);
}


void loop() {
  WiFiClient client;
  if (!connectToServer(client)) {
    return;
  }

  fetchSchedules(client);

  if (isScheduledTime()) {
    executeScheduledActions(client);
  }

  int distanceValue = distance.getDistance();
  float weight = scale.get_units();
  sendSensorData(client, distanceValue, weight);

  client.stop();
  delay(1000);
}
