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
#include "HX711.h"

#include <ArduinoJson.h>
#include "time.h"
#include <Distance.h>


const char* ssid = "iPhone123";
const char* password = "12345678";

// Motor connection pins
int en = 9;   // Enable pin
int in1 = 8;  // Input 1
int in2 = 7;  // Input 2


// Distance pins
int trig = 2;
int echo = 3;

// load cell Pins
int dout = 4;
int sck = 5;
float calibration_factor = -1100;

HX711 scale;


Motor Motor(en, in1, in2);
Distance Distance(trig, echo);

// Time related constants
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600;
const int   daylightOffset_sec = 3600;

void setup() {
  Serial.begin(115200);  // Initialize serial communication for debugging
  Motor.initMotor();

  scale.begin(dout,sck);
  scale.set_scale(calibration_factor);
  scale.tare();

  Distance.init();
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
    // client.stop();
    // return;
  }

  // Skip HTTP headers
  char endOfHeaders[] = "\r\n\r\n";
  if (!client.find(endOfHeaders)) {
    Serial.println(F("Invalid response"));
    //client.stop();
    // return;
  }

  // Allocate the JSON document
  DynamicJsonDocument doc(200);

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, client);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    client.stop();
    // return;
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


   if (!client.connect(serverAddress, port)) {
    Serial.println("Initial Connection failed between client and server");
    return;
  }

  if(scheduledHour==timeinfo.tm_hour && scheduledMinut==timeinfo.tm_min){
    Serial.print("Start MOTOR");
    Motor.startMotor(true);
    Motor.speed(100);
    getRequest(client, serverAddress, "/removeSchedule");

  }
  else{
    
    Motor.stopMotor();
  }
  
 

 if (!client.connect(serverAddress, port)) {
    Serial.println("Initial Connection failed between client and server");
    return;
  }

int  dist = Distance.getDistance();
Serial.print(dist);
Serial.println("cm");

// print weight
float weight = scale.get_units();
Serial.print(weight);
Serial.println("g");

// Building post request
String data = "{\"dist\": " + String(dist) + ",\"weight\":" + String(weight)+ "}";
String request = "POST /uploadDistanceSensorValue HTTP/1.1\r\n";
String host = "Host: " + String(serverAddress) + ":" + String(port) + "\r\n";
String contentType = "Content-Type: application/json\r\n";
String contentLength = "Content-Length: " + String(data.length()) + "\r\n";
String connection = "Connection: close\r\n\r\n";

request += host;
request += contentType;
request += contentLength;
request += connection;
request += data;

    // Send the request
    client.print(request);
   // Serial.println(request);


// handle response
  String response = ""; // Initialize empty string to store response

 while (client.connected() || client.available()) {
   // while (client.available()) {
        char c = client.read();
        response += c; // Append each read character into the response string
   // }

}

    



  client.stop();

  


  delay(1000);  // Adjust delay as needed
}
