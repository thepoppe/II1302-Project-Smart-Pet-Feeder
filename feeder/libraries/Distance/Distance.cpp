#include "Distance.h"

Distance::Distance(int trig, int echo){
    _trig = trig;
    _echo = echo;
}

void Distance::init(){
    pinMode(_trig, OUTPUT);
    pinMode(_echo, INPUT);
}

int Distance::getDistance(){
    // Send trigger pulse LOW  HIGH LOW.
    digitalWrite(_trig,LOW);
    delayMicroseconds(5);
    digitalWrite(_trig,HIGH);
    delayMicroseconds(20);
    digitalWrite(_trig,LOW);
    
    long pulseTime = pulseIn(_echo,HIGH)/2; //  pulse in gives RTT so div 2 gives One way trip time
    return convertMicrosecToCenti(pulseTime);
}

int Distance::convertMicrosecToCenti(long microseconds){
    return microseconds * 34/1000;
}