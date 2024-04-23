#ifndef MOTOR_H
#define MOTOR_H

#include <Arduino.h>

class Motor
{
    private:
        int _en;
        int _in1;
        int _in2;
    public:
        Motor(int en, int in1, int in2);
        void initMotor();
        void startMotor();
        void stopMotor();
        void speed(int speed);
};

#endif

