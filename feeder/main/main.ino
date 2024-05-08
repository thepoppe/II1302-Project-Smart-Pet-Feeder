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
#include <WebServer.h>
#include <Motor.h>
#include <HX711.h>
#include <ArduinoJson.h>
#include <Distance.h>
#include "time.h"
#include <cstring>

String ssid = "iPhone123";
String password = "12345678";
String userId = "vxq2MZ9zwfMEvRh1Ao7FTO5hwZL2"; // make it not hardcoded. It is Lukas uid rn
const char* arduinoSSID = "Pet-Feeder-Setup";
const char* ArduinoPassword = "123456789";

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 3600;
const int daylightOffset_sec = 3600;
const char* serverAddress = "172.20.10.3";
const int serverPort = 3000;
int schedule[5] = {0};
String scheduleID = "";
int scheduledWeight = 0;


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





void connectToWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}


void moveRotorToOpen(bool open, int time) {
  motor.startMotor(open); 
  motor.speed(250);
  delay(time);
  motor.stopMotor();
}



bool connectToServer(WiFiClient& client) {
  if (!client.connect(serverAddress, serverPort)) {
    Serial.println("Failed to connect to server");
    return false;
  }
  return true;
}

// CODE for fetchSchedules WAS TAKEN FROM  https://arduinojson.org/v7/example/http-client/
void fetchSchedules(WiFiClient& client) {
  if (!connectToServer(client)){
    return;
  }
  String request = "GET /users/"+userId+"/next-schedule HTTP/1.1\r\nHost: " + String(serverAddress) + "\r\nConnection: close\r\n\r\n";
  client.print(request);
  Serial.println("Waiting for response...");

  char status[32] = {0};
  client.readBytesUntil('\r', status, sizeof(status));
  if (strcmp(status + 9, "200 OK") != 0) {
    Serial.print(F("Unexpected response: "));
    Serial.println("Status: ");
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
  schedule[0] = doc["month"];
  schedule[1] = doc["day"];
  schedule[2] = doc["hour"];
  schedule[3] = doc["minute"];

  
  const char* id = doc["id"];
  scheduleID = String(id);
  scheduledWeight = doc["amount"];
  
  
  //Serial.println(scheduleID);
   
  //serializeJson(doc,Serial); // Debug code  remove after when not needed
  // Serial.println();
  return;
}

bool isScheduledTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return false;
  }

  if (schedule[0] < 0) {
    return false;
  }

  int scheduledMonth = schedule[0];
  int scheduledDay = schedule[1];
  int scheduledHour = schedule[2];
  int scheduledMinute = schedule[3];
  
  

  return(scheduledMonth == timeinfo.tm_mon && scheduledDay == timeinfo.tm_mday && scheduledHour == timeinfo.tm_hour && scheduledMinute == timeinfo.tm_min);
}



void clearSchedules(WiFiClient& client){
  Serial.println("Clear Schedules");
  if (!connectToServer(client)){
    return;
  }

  
  String data = "{\"id\":\""+scheduleID+ "\"}";
  String request = "POST /users/"+userId+"/removeSchedule HTTP/1.1\r\nHost: " + String(serverAddress) + ":" + String(serverPort) 
  + "\r\nContent-Type: application/json\r\nContent-Length: " + String(data.length()) + "\r\nConnection: close\r\n\r\n" + data;




  client.print(request);
  for(int i = 0; i < sizeof(schedule) / sizeof(int); i++){
    schedule[i] = 0;
  }
  return;
}


void executeScheduledActions() {
  float currentWeight = scale.get_units() * -1;
  Serial.println("Start MOTOR");



  while(currentWeight  < scheduledWeight) { 
    Serial.println(currentWeight);
    moveRotorToOpen(true, 500);
    delay(100);
    moveRotorToOpen(false, 600);
    currentWeight = scale.get_units() * -1;
  }
}

void sendSensorData(WiFiClient& client) {
  int distanceValue = distance.getDistance();
  float weight = scale.get_units();

  // if data is changed send update
  if (!connectToServer(client)){
    return;
  }
  String data = "{\"dist\": " + String(distanceValue) + ",\"weight\": " + String(weight) + "}";
  
  String request = "POST /users/"+userId+"/uploadSensorValues HTTP/1.1\r\nHost: " + String(serverAddress) + ":" + String(serverPort) 
  + "\r\nContent-Type: application/json\r\nContent-Length: " + String(data.length()) + "\r\nConnection: close\r\n\r\n" + data;

  
  client.print(request);
}




/**********************************************
Code for wifiCredentialSetup() and sendWifiHTML() inspired by Rui Santos at
https://randomnerdtutorials.com/esp32-access-point-ap-web-server/
Some parts copied, some parts modified
***********************************************/
void sendWifiHTML(WiFiClient& client, bool done, String addr) {
  // Send the HTML content to the client
  client.println("<!DOCTYPE html><html>");
  client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
  client.println("<link rel=\"icon\" href=\"data:,\">");
  client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
  client.println(".button { background-color: #4CAF50; border: none; color: white; padding: 16px 40px; text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
  client.println(".button2 {background-color: #555555;}</style></head>");
  client.println("<body>");
  
  if (!done) {
    client.println("<h1>Smart Pet Feeder Wifi Setup</h1>");
    client.println("<form id=\"wifi-form\" action=\"/submit\">");
    client.println("<label for=\"wifi\">Enter Wifi SSID:</label><br>");
    client.println("<input type=\"text\" id=\"wifi\" name=\"wifi\" /><br>");
    client.println("<label for=\"pw\">Enter Wifi Password:</label><br>");
    client.println("<input type=\"text\" id=\"pw\" name=\"pw\" /><br>");
    client.println("<input type=\"submit\" value=\"Submit\"></input>");
    client.println("</form>");
  } else {
    client.println("<h1>Setup Complete, Read carefully</h1>");
    client.println("<p>Pet Feeder is now connected to your wifi</p>");
    client.println("<p>Disconnect from Pet Feeders Wifi and Connect to the same wifi with your device.</p>");
    client.println("<p>Go to Smartpetfeeder.com and login.</p>");
    client.println("<p>Click on setting and connect device.</p>");
    client.println("<p>Enter this \"" + String(addr) + "\" in the box and press Connect </p>");
    client.println("<p>You are done!</p>");
  }
  client.println("</body></html>");
}

String readHTTPRespons(WiFiClient& client) {
    String firstLine = "";
    while (!firstLine.endsWith("\r\n")) {
      if (client.available()) {
      char c = client.read();
      firstLine += c;
      }
    }
    return firstLine;
}

bool readWifiCredentials(WiFiClient& client) {
  String firstLine = readHTTPRespons(client);

  if (firstLine.startsWith("GET /submit")) {
    String params = firstLine.substring(firstLine.indexOf("?") + 1);
    int paramSplitter = params.indexOf('&');
    String ssidParam = params.substring(0, paramSplitter);
    String pwParam = params.substring(paramSplitter + 1);
    ssidParam = ssidParam.substring(ssidParam.indexOf("=") + 1);
    ssidParam.replace("+", " ");
    ssid = ssidParam.c_str();
    password = pwParam.substring(pwParam.indexOf("=") + 1, pwParam.indexOf(" ")).c_str();
    return true;
  }
  return false;
}



void wifiCredentialSetup() {
  Serial.println("Wifi Credentials missin...");
  Serial.println("AccessPoint created");
  IPAddress staticIP(192, 168, 1, 1);
  IPAddress gateway(192, 168, 1, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFiServer server(80);

  WiFi.softAPConfig(staticIP, gateway, subnet);
  WiFi.softAP(arduinoSSID, ArduinoPassword);

  IPAddress IP = WiFi.softAPIP();
  server.begin();

  while (true) {
    WiFiClient client = server.available();

    if (client) {
      Serial.println("New Client.");

      while (client.connected()) {
        if (client.available()) {
          bool success = readWifiCredentials(client);
          if(success){
            Serial.println("Success, Wifi credentials collected");
            Serial.println("ssid: "+ ssid);
            Serial.println("password: "+ password);
            connectToWifi();
            IPAddress IP = WiFi.localIP();
            sendWifiHTML(client, true, String(IP[0]) + "." + String(IP[1]) + "." + String(IP[2]) + "." + String(IP[3]));
            server.end();
            return;
          }
          break;
        }
      }
      sendWifiHTML(client, false, "");
      client.stop();
      Serial.println("Client disconnected."); 
    }
  }
}


void handleAuth(WebServer& server) {
  Serial.println("handle auth");
  if (server.method() == HTTP_POST) {
    Serial.println("Post request");
    String authToken = server.arg("plain");
    Serial.println("Received token: " + authToken);
    userId = authToken;
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "text/plain", "Received POST request to /auth");
  } else {
    server.send(405, "text/plain", "Method Not Allowed");
  }
}

void verifyUser() {
  Serial.println("Listening for connections on Auth endpoint");

  WebServer server(80);
  server.on("/auth", HTTP_POST, std::bind(handleAuth, std::ref(server)));
  server.begin();

  while (userId.isEmpty()) {
    server.handleClient();
    delay(2000);
  }
}


void setup() {
  Serial.begin(115200);
  Serial.println("Setup started");
  motor.initMotor();
  scale.begin(doutPin, sckPin);
  scale.set_scale(calibrationFactor);
  scale.tare();
  distance.init();
  if (ssid.isEmpty() || password.isEmpty()) {
    wifiCredentialSetup();
  }
    connectToWifi();
  if (userId.isEmpty()){
    verifyUser();
  }

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}


void loop() {
  WiFiClient client;
  fetchSchedules(client);

  if (isScheduledTime()) {
    clearSchedules(client);
    executeScheduledActions();
  }
  sendSensorData(client);
  client.stop();

  delay(1000);
}
