#include <Motor.h>

int en = 9;
int in1 = 8;
int in2 = 7;
Motor Motor(en,in1,in2);
void setup() {
  // put your setup code here, to run once:
 Motor.initMotor();
}

void loop() {
  Motor.startMotor(1);
  Motor.speed(220);
  delay(10);
  Motor.speed(50);
  delay(100);
  Motor.speed(40);
  delay(1000);
  Motor.speed(30);
  delay(1000);

  Motor.stopMotor();
  delay(2000);
  Motor.startMotor(0);
  Motor.speed(220);
  delay(10);
  Motor.speed(50);
  delay(100);
  Motor.speed(40);
  delay(1000);
  Motor.speed(30);
  delay(1000);



}
