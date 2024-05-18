import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Progress } from 'antd';
import './statusPage.css';
const ip = `${import.meta.env.VITE_SERVER_IP_ADDRESS}`;

export default function WeightGraph() {
    const [weights, setWeights] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    function getStatusValues() {
        const userId = localStorage.getItem('userId');
        fetch(`${ip}/users/${userId}/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setWeights(data.map(status => Math.floor(Math.abs(parseFloat(status.weight)))));
            setTimestamps(data.map(status => new Date(status.timestamp._seconds * 1000)));
        })
        .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        getStatusValues(); 
    }, []);
    

    const chartData = timestamps.map((timestamp, index) => ({
        time: timestamp,
        weight: weights[index]
    }));

    const config = {
        data: chartData,
        xField: 'time',
        yField: 'weight',
        width: 800,
        height: 240,
        
    };


    return (
        
            <div className="statusItems history">
                <h2>Food-level in bowl over time</h2>
                <div className='chart'>
                    <Line {...config} />
                </div>
            </div>
      
    );
}
