#include <WiFi.h> // Include WiFi library for example (or Bluetooth.h)
#include <WiFiClient.h>


const char* ssid = "iPhone123";
const char* password = "12345678";

// Motor connection pins
int enA = 9; // Enable pin
int in1 = 8; // Input 1
int in2 = 7; // Input 2

void setup() {
  Serial.begin(115200); // Initialize serial communication for debugging
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);

// Turn off motors
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);

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

void startMotor(int inputSpeed) {
  digitalWrite(in1, HIGH);
	digitalWrite(in2, LOW);
  speed(inputSpeed);
} 

void speed(int inputSpeed){
  if (inputSpeed >=256){
    Serial.write("too much speed");
    return;
  }
  analogWrite(enA,inputSpeed);
}

void stopMotor() {
  digitalWrite(in1, LOW);
	digitalWrite(in2, LOW);
}

void loop() {
  // Code to send and receive data packets over WiFi
  // You'll need functions to establish connection with the other ESP32
  // and exchange data based on the chosen protocol (TCP/UDP)
  WiFiClient client;

  // Specify the server address and port (usually port 80 for HTTP)
  const char* serverAddress = "172.20.10.11";
  const int port = 3000;
 if (!client.connect(serverAddress, port)) {
    Serial.println("Initial Connection failed between client and server");
    return;
  }

  String request = "GET /motor-status HTTP/1.1\r\nHost: ";
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
    Serial.println("Response received and it is:");
    Serial.println(response);

    if (response.indexOf("true") != -1){
      Serial.println("Motor should run");
      startMotor(100);
  
    } else {
    Serial.println("Motor should stop");
    stopMotor();
}  
  } else {
    Serial.println("No response received.");
    stopMotor();
  }
  

  delay(100); // Adjust delay as needed

}
