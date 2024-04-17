#include <WiFi.h> // Include WiFi library for example (or Bluetooth.h)
#include <WiFiClient.h>

const char* ssid = "Poppes iPhone";
const char* password = "12345678";

void setup() {
  Serial.begin(115200); // Initialize serial communication for debugging

  WiFi.begin(ssid, password); // Connect to Wi-Fi network
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
   IPAddress ip = WiFi.localIP(); 
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {
  // Code to send and receive data packets over WiFi
  // You'll need functions to establish connection with the other ESP32
  // and exchange data based on the chosen protocol (TCP/UDP)
  WiFiClient client;

  // Specify the server address and port (usually port 80 for HTTP)
  const char* serverAddress = "172.20.10.7";
  const int port = 3000;
 if (!client.connect(serverAddress, port)) {
    Serial.println("Connection failed");
    return;
  }

  String request = "GET /test HTTP/1.1\r\nHost: ";
  request += serverAddress;
  request += "\r\nConnection: close\r\n\r\n";
  client.print(request);

  Serial.println("Waiting for response...");

  String response = ""; // Initialize empty string to store response
 while (client.connected() || client.available()) {
   // while (client.available()) {
        char c = client.read();
        response += c; // Append each read character into the response string
   // }
}
  client.stop();

  if (response.length() > 0) {
    Serial.println("Response received!");
    Serial.println(response);
  } else {
    Serial.println("No response received.");
  }

  delay(10000); // Adjust delay as needed

}
