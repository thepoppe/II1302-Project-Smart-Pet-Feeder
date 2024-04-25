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
  Motor.startMotor();
  delay(2000);
  Motor.speed(255);
  delay(2000);
  Motor.speed(20);
  delay(2000);
  Motor.stopMotor();
}
