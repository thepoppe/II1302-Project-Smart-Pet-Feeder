
import React, { useState,useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {Progress } from 'antd';
import './statusPage.css'
import WeightGraph from './WeightGraph';
const ip = `localhost:3000`;

export default function StatusView() {
    const [distance, setDistance] = useState(0);
    const [weight,setWeight]=useState(0);
    const maxDistance=10;
    const maxWeight=30;

    // Removes decimals and makes sure its under 100
    const distancePercentage = Math.min(100 - Math.round((distance / maxDistance) * 100), 100); 
    const weightPercentage = Math.min(Math.round((weight / maxWeight) * 100), 100);

    function getSensorValues() {
        const userId = localStorage.getItem('userId');
        fetch(`${ip}/users/${userId}/sensorValues`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            
            setDistance(data.dist);
            setWeight(data.weight);
        }).catch(error => console.error('Error:', error));
    }
    useEffect(() => {
        getSensorValues(); // Run initially
        }, []);





    return (<>
        <div className="statusContainer">
            <div className="statusItems">
            <h2>Food-level in container</h2>
               <div className='foodContainer' >
                
                {50 < distancePercentage && distancePercentage <= 100 ? (
                    <Progress type="circle" percent={distancePercentage} strokeColor="green"  strokeWidth={8} circleIconFontSize='2em' size={200} />
                ) : 20 < distancePercentage && distancePercentage <= 50 ? (
                    <Progress type="circle" percent={distancePercentage} strokeColor=" yellow"  strokeWidth={8} circleIconFontSize='2em' size={200} />
                ) : (
                    <Progress type="circle" percent={distancePercentage} strokeColor="red"  strokeWidth={8} circleIconFontSize='2em' size={200} />
                )}
                </div>
            </div>
            <div className="statusItems">
                <h2>Food-level in Bowl</h2>
                <div className='bowl'>
                <Progress type="circle" percent={weightPercentage} format={(percent) => `${weight} gram`}  size={200} />
                </div>
            </div>
            <WeightGraph></WeightGraph>
        </div>
    </>);
}

