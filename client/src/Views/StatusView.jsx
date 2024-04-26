import React, { useState,useEffect } from 'react';


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
    
                setDistance(data.currentValue);
            
        })
        .catch(error => console.error('Error:', error));
    };
    

    return (
        <div className="status-container">
            <h1>Petfeeder</h1>
            <div className="order-section">
                <button onClick={getDistanceSensor} className="centered-button">Update Now</button>
            </div>
            <div className="food-level-container">
                <div className="food-level-indicator" style={{ height: '50%' }}>
                    <span className="food-level-text">{distance}</span>
                </div>
            </div>
            <div className="history-section">
                <h2>History</h2>
                <div className="history-graph-placeholder">Placeholder for Graph</div>
            </div>
        </div>
    );
}



