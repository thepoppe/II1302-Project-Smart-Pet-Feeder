export function compareDatesCB(d1, d2){
    if(d1.month - d2.month){
      return d1.month - d2.month;
    }
    else if (d1.day-d2.day){
      return d1.day-d2.day
    }
    else if(d1.hour-d2.hour){
      return d1.hour-d2.hour
    }
    else if(d1.minute-d2.minute){
      return d1.minute-d2.minute
    }
    // Same month-day-hour-minute
    else{
      return 0
    }
  }