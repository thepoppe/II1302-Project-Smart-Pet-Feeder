#include "Motor.h"

// Motor connection pins
// int enA = 9; // Enable pin
// int in1 = 8; // Input 1
// int in2 = 7; // Input 2



Motor::Motor(int en, int in1, int in2){
  _en = en;
  _in1 = in1;
  _in2 = in2;
}


void Motor::initMotor(){
  pinMode(_en, OUTPUT);
  pinMode(_in1, OUTPUT);
  pinMode(_in2, OUTPUT);
}


void Motor::startMotor() {
  digitalWrite(_in1, HIGH);
	digitalWrite(_in2, LOW);
} 

void Motor::stopMotor() {
  digitalWrite(_in1, LOW);
	digitalWrite(_in2, LOW);
}

void Motor::speed(int speed){
  if (speed >=256){
    return;
  }
  analogWrite(_en,speed);
}

