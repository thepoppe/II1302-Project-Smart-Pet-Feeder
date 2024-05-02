import React, { useState,useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {Progress } from 'antd';
import './statusPage.css'

export default function StatusView() {
    const [distance, setDistance] = useState('');
    const maxDistance=20;
    const [weight,setWeight]=useState('');

    function getSensorValues() {
        fetch('http://localhost:3000/sensor-values', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setDistance(data.distance);
            setWeight(data.weight);
        })
        .catch(error => console.error('Error:', error));
    }

    function colour(percentage) {
        if (percentage >= 70) { 
            return '#76b947'; // green
        } else if (percentage >= 30) {
            return '#f7ea48'; // yellow
        } else {
            return '#e94f37'; // red
        }
    }

    const percentage = Math.min(Math.round((distance / maxDistance) * 100), 100);




    useEffect(() => {
        getSensorValues(); // Run it initially
        const interval = setInterval(() => {
        getSensorValues();}, 1000); // Update every 1000 milliseconds (1 second)
        return () => clearInterval(interval); // Clean up the interval
    }, []); 

    useEffect(() => {
        if (distance && percentage < 30) {
            alert('Food level is low! Needs refill!');
        }
    }, [percentage]);


    };
    
    const amount = 60;

    const data = [
        { day: '1991', amount: 80 },
        { day: '1992', amount: 80 },
        { day: '1993', amount: 70 },
        { day: '1994', amount: 75 },
        { day: '1995', amount: 60 },
        { day: '1996', amount: 70 },
        { day: '1997', amount: 80 },
        { day: '1998', amount: 60 },
        { day: '1999', amount: 60 },
      ];
      const config = {
        data,
        xField: 'day',
        yField: 'amount',
        point: {
          shapeField: 'square',
          sizeField: 5,
        },
        interaction: {
          tooltip: {
            marker: true,
          },
        },
        style: {
          lineWidth: 2,
        },
      };

    return (
        <div className="statusContainer">
            <div className="statusItems">
            <h2>Food-level in container</h2>
               <div className='foodContainer' >
                
                {50 < amount && amount <= 100 ? (
        <Progress type="circle" percent={amount} strokeColor="green"  strokeWidth={8} circleIconFontSize='2em' size={200} />
                ) : 20 < amount && amount <= 50 ? (
                    <Progress type="circle" percent={amount} strokeColor=" yellow"  strokeWidth={8} circleIconFontSize='2em' />
                ) : (
                    <Progress type="circle" percent={amount} strokeColor="red"  strokeWidth={8} circleIconFontSize='2em' />
                )}
                <button onClick={getSensorValues} className="updateBTN">Update Now</button>
                </div>
            </div>
            <div className="statusItems">
                <h2>Eat pattern</h2>
                <div className="history-graph-placeholder">
                    <Line  {...config}/>
            <div className="food-level-container">
            <div className="food-level-indicator" style={{ height: `${percentage}%`, backgroundColor: colour(percentage) }}>
            <span className="food-level-text">{percentage}%</span>
                </div>
               
            </div>

            <div>

            <span className="food-level-text">{weight}g</span>
            </div>
            <div className="statusItems bowl">
            <h2>food in bowl</h2>
            </div>
            
        </div>
    );
}
