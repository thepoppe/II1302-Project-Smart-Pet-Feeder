#include <WiFi.h>  // Include WiFi library for example (or Bluetooth.h)
#include <WiFiClient.h>

#include <Motor.h>

#include <ArduinoJson.h>

const char* ssid = "iPhone123";
const char* password = "12345678";

// Motor connection pins
int en = 9;   // Enable pin
int in1 = 8;  // Input 1
int in2 = 7;  // Input 2

Motor Motor(en, in1, in2);

void setup() {
  Serial.begin(115200);  // Initialize serial communication for debugging
  Motor.initMotor();

  WiFi.begin(ssid, password);  // Connect to Wi-Fi network
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}








void loop() {
  // Code to send and receive data packets over WiFi
  // You'll need functions to establish connection with the other ESP32
  // and exchange data based on the chosen protocol (TCP/UDP)
  WiFiClient client;

  // Specify the server address and port (usually port 80 for HTTP)
  const char* serverAddress = "172.20.10.3";
  const int port = 3000;
  if (!client.connect(serverAddress, port)) {
    Serial.println("Initial Connection failed between client and server");
    return;
  }

  String request = "GET /getschedules HTTP/1.1\r\nHost: ";
  request += serverAddress;
  request += "\r\nConnection: close\r\n\r\n";
  client.print(request);

  Serial.println("Waiting for response...");


  // CODE BELOW WAS TAKEN FROM  https://arduinojson.org/v7/example/http-client/
  // so understand and either remake or give sources to it

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
  
  serializeJson(doc,Serial);
  Serial.println();
  int day = doc["day"];
  Serial.print("DAy: ");
  Serial.println(day);

  client.stop();




  delay(100);  // Adjust delay as needed
}
