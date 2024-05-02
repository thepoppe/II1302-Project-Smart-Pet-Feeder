import React, { useState,useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {Progress } from 'antd';
import './statusPage.css'

export default function StatusView() {

    const [distance, setDistance] = useState('');

    function getDistanceSensor(){
        fetch('http://localhost:3000/distance-sensor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
    
                setDistance(data.currentamount);
            
        })
        .catch(error => console.error('Error:', error));
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
                <button onClick={getDistanceSensor} className="updateBTN">Update Now</button>
                </div>
            </div>
            <div className="statusItems">
                <h2>Eat pattern</h2>
                <div className="history-graph-placeholder">
                    <Line  {...config}/>
                </div>
            </div>
            <div className="statusItems bowl">
            <h2>food in bowl</h2>
            </div>
            
        </div>
    );
}



