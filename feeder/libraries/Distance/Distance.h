#ifndef DISTANCE_H
#define DISTANCE_H

#include <Arduino.h>

class Distance
{
    private:
        int _trig;
        int _echo;
        int convertMicrosecToCenti(long microseconds); 
    public:
       Distance(int trig, int echo);
       void init();
       int getDistance();
};

#endif

