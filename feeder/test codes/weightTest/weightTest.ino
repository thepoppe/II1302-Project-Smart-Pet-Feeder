#include "HX711.h"
int DOUT_PIN = 4;
int SCK_PIN = 5;

float calibration_factor = -1100;
HX711 scale;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  scale.begin(DOUT_PIN, SCK_PIN);
  scale.set_scale(calibration_factor);
  scale.tare();
}

void loop() {
  // put your main code here, to run repeatedly:

  
  Serial.print(scale.get_units(), 1);
  Serial.print(" g");
  Serial.println();
  delay(100);
}
