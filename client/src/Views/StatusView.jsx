import React, { useState,useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {Progress } from 'antd';
import './statusPage.css'

export default function StatusView() {
    const [distance, setDistance] = useState(0);
    const maxDistance=20;
    const [weight,setWeight]=useState('');
    const percentage = Math.min(Math.round((distance / maxDistance) * 100), 100);

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

   





    useEffect(() => {
        getSensorValues(); // Run it initially
       
    }, []); 

    

//GRaf dummy
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
          shapeField: 'circle',
          sizeField: 2,
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
        <>
        <div className="statusContainer">
            <div className="statusItems">
            <h2>Food-level in container</h2>
               <div className='foodContainer' >
                
                {50 < percentage && percentage <= 100 ? (
                    <Progress type="circle" percent={percentage} strokeColor="green"  strokeWidth={8} circleIconFontSize='2em' size={200} />
                ) : 20 < percentage && percentage <= 50 ? (
                    <Progress type="circle" percent={percentage} strokeColor=" yellow"  strokeWidth={8} circleIconFontSize='2em' />
                ) : (
                    <Progress type="circle" percent={percentage} strokeColor="red"  strokeWidth={8} circleIconFontSize='2em' />
                )}
                <button onClick={getSensorValues} className="updateBTN">Update Now</button>
                </div>
            </div>
            <div className="statusItems">
                <h2>Food-level in Bowl</h2>
            </div>
        </div>
        <div>
            <h2>Eat pattern</h2>
            <div className="history-graph-placeholder">
                <Line  {...config}/>
            </div>
        </div>
    </>
    )
}