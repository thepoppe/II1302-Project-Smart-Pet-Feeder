
import React, { useState,useEffect } from 'react';
import { Line } from '@ant-design/plots';
import {Progress } from 'antd';
import './statusPage.css'
import WeightGraph from './WeightGraph';
const ip = `${import.meta.env.VITE_SERVER_IP_ADDRESS}`;

export default function StatusView() {
    const [distance, setDistance] = useState(0);
    const [weight,setWeight]=useState(0);

    const midlevel=4;
    const maxDistance=8;
    const maxWeight=30;

    // Removes decimals and makes sure its under 100
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

            setWeight(Math.floor(Math.abs(data.weight)));
        }).catch(error => console.error('Error:', error));
    }
    useEffect(() => {
        getSensorValues();
        }, []);



    return (<>
        <div className="statusContainer">
            <div className="statusItems">
            <h2>Food-level in container</h2>
                <div className='foodContainer' >
                    {distance >= midlevel + 3 ? (
                    <Progress
                        type="circle"
                        percent={33}
                        strokeColor="red"
                        strokeWidth={8}
                        circleIconFontSize="2em"
                        size={200}
                        format={() => <span style={{ color: 'red' }}>Low</span>}
                    />) : distance >= midlevel  ? (
                    <Progress
                        type="circle"
                        percent={66}
                        strokeColor="yellow"
                        strokeWidth={8}
                        circleIconFontSize="2em"
                        size={200}
                        format={() => <span style={{ color: 'yellow' }}>Medium</span>}
                    />) : (
                    <Progress
                        type="circle"
                        percent={100}
                        strokeColor="green"
                        strokeWidth={8}
                        circleIconFontSize="2em"
                        size={200}
                        format={() => <span style={{ color: 'green' }}>High</span>}
                    />)}
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

