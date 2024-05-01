import React, { useState,useEffect } from 'react';

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
        if (percentage < 30) {
            alert('Food level is low! Needs refill!');
        }
    }, [percentage]);


    return (
        <div className="status-container">
            <h1></h1>
            <div className="order-section">
                <button onClick={getSensorValues} className="centered-button">Update Now</button>
            </div>
            <div className="food-level-container">
            <div className="food-level-indicator" style={{ height: `${percentage}%`, backgroundColor: colour(percentage) }}>
            <span className="food-level-text">{percentage}%</span>
                </div>
               
            </div>

            <div>

            <span className="food-level-text">{weight}g</span>
            </div>
            <div className="history-section">
                <h2>History</h2>
                <div className="history-graph-placeholder">Placeholder for Graph</div>
            </div>
        </div>
    );
}
