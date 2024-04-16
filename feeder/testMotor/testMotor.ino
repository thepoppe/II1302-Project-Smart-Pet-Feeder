// Motor connection pins
int enA = 9; // Enable pin
int in1 = 8; // Input 1
int in2 = 7; // Input 2

void setup() {
  Serial.begin(9600);
  // set motor control pins to out
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);

// Turn off motors
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
}

void loop() {
  startMotor(100);
  delay(2000);
  speed(50);
  delay(2000);
  stopMotor();
  delay(2000);
}

void startMotor(int speed) {
  digitalWrite(in1, HIGH);
	digitalWrite(in2, LOW);
  speed(speed);
} 

void stopMotor() {
  digitalWrite(in1, LOW);
	digitalWrite(in2, LOW);
}


void speed(int speed){
  if (speed >=256){
    Serial.write("too much speed");
    return;
  }
  analogWrite(enA,speed);
}