import React, { useState,useEffect } from 'react';

export default function StatusView() {
    const [distance, setDistance] = useState('');
    const maxDistance=100

    function getDistanceSensor() {
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
    }

    function colour(distance) {
        const percentage=distance/maxDistance;
        if (percentage >= 0.7) { 
            return '#76b947'; // green
        } else if (percentage >= 0.3) {
            return '#f7ea48'; // yellow
        } else {
            return '#e94f37'; // red
        }
    }
 

    
    return (
        <div className="status-container">
            <h1></h1>
            <div className="order-section">
                <button onClick={getDistanceSensor} className="centered-button">Update Now</button>
            </div>
            <div className="food-level-container">
                <div className="food-level-indicator" style={{ height: `${distance}%`, backgroundColor: colour(distance) }}>
                    <span className="food-level-text">{distance}%</span>
                </div>
            </div>
            <div className="history-section">
                <h2>History</h2>
                <div className="history-graph-placeholder">Placeholder for Graph</div>
            </div>
        </div>
    );
}
