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

#include <WiFi.h>  // Include WiFi library for example (or Bluetooth.h)
#include <WiFiClient.h>

#include <Motor.h>

#include <ArduinoJson.h>
#include "time.h"

const char* ssid = "iPhone123";
const char* password = "12345678";

// Motor connection pins
int en = 9;   // Enable pin
int in1 = 8;  // Input 1
int in2 = 7;  // Input 2

Motor Motor(en, in1, in2);

// Time related constants
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600;
const int   daylightOffset_sec = 3600;

void setup() {
  Serial.begin(115200);  // Initialize serial communication for debugging
  Motor.initMotor();
  connectToWifi(ssid, password);
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

}

  
  void connectToWifi(const char* ssid, const char* pass){
    WiFi.begin(ssid, password);  // Connect to Wi-Fi network
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.println("Connecting to WiFi..");
    }
    Serial.print("Connected");
  }

  
  void getRequest(WiFiClient client, const char* serverAddress, char* resourceToGet){
      String request = "GET "; 
      request +=  resourceToGet;
      request += " HTTP/1.1\r\nHost: ";
      request += serverAddress;
      request += "\r\nConnection: close\r\n\r\n";
      client.print(request);
  }

 \ void postRequest(WiFiClient client, const char* serverAddress, char* resourceToGet, DynamicJsonDocument doc){
 \     String data;
 \     serializeJson(doc,data);
 \     
 \     String request = "POST "; 
 \     request +=  resourceToGet;
 \     request += " HTTP/1.1\r\nHost: ";
 \     request += serverAddress;
 \     request += "\r\nContent-Type: application/json";
 \     request += "\r\nContent-Length: ";
 \     request += String(data.length());
 \     request += "\r\nConnection: close\r\n\r\n";
 \     
 \     request += data;
 \     client.print(request);
 \     Serial.print(data);
 \     Serial.print(String(data.length()));
 \ }


void loop() {
  // Code to send and receive data packets over WiFi
  WiFiClient client;

  // Specify the server address and port (usually port 80 for HTTP)
  const char* serverAddress = "172.20.10.3";
  const int port = 3000;
  if (!client.connect(serverAddress, port)) {
    Serial.println("Initial Connection failed between client and server");
    return;
  }

  getRequest(client, serverAddress, "/getschedules");
    

      //String request = "GET /getschedules HTTP/1.1\r\nHost: ";
      //request += serverAddress;
      //request += "\r\nConnection: close\r\n\r\n";
      //client.print(request);



  Serial.println("Waiting for response...");


  // CODE BELOW WAS TAKEN FROM  https://arduinojson.org/v7/example/http-client/

  // Check HTTP status
  char status[32] = { 0 };
  client.readBytesUntil('\r', status, sizeof(status));
  // It should be "HTTP/1.0 200 OK" or "HTTP/1.1 200 OK"
  if (strcmp(status + 9, "200 OK") != 0) {
    Serial.print(F("Unexpected response: "));
    Serial.println(status);
    client.stop();
    return;
  }

  // Skip HTTP headers
  char endOfHeaders[] = "\r\n\r\n";
  if (!client.find(endOfHeaders)) {
    Serial.println(F("Invalid response"));
    client.stop();
    return;
  }

  // Allocate the JSON document
  DynamicJsonDocument doc(200);

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, client);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    client.stop();
    return;
  }

  // Extract values
  Serial.println(F("Response:"));
  
  // END OF CODE TAKEN FROM WEBSITE


  serializeJson(doc,Serial); // Debug code  remove after when not needed
  Serial.println();

  int scheduledHour= doc["hour"];
  int scheduledMinut = doc["minute"];

  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }

  int currentHour =  timeinfo.tm_hour;


  
  if(scheduledHour==timeinfo.tm_hour && scheduledMinut==timeinfo.tm_min){
    Serial.print("Start MOTOR");
    Motor.startMotor();
    Motor.speed(100);
  }
  else{
    Serial.print("whaa...");
    Motor.stopMotor();
  }
  
  DynamicJsonDocument doc1(200);
  doc1["value"] = 42;


  
 \\ String request = "POST /uploadDistanceSensorValue HTTP/1.1\r\nHost: ";
 \\     request += serverAddress;
 \\     request += "\r\nContent-Type: application/json";
 \\     request += "\r\nContent-Length: ";
 \\     request += 
 \\     request += "\r\nConnection: close\r\n\r\n";
 \\     
 \\     request += data;
 \\     client.print(request);

  postRequest(client, serverAddress,  "/uploadDistanceSensorValue",  doc1);
  

  client.stop();




  delay(1000);  // Adjust delay as needed
}
