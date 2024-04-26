import React from 'react';

export default function StatusView() {
    return (
        <div className="status-container">
            <h1>Petfeeder</h1>
            <div className="order-section">
                <button className="centered-button">Update Now</button>
            </div>
            <div className="food-level-container">
                <div className="food-level-indicator" style={{ height: '50%' }}>
                    <span className="food-level-text">50%</span>
                </div>
            </div>
            <div className="history-section">
                <h2>History</h2>
                <div className="history-graph-placeholder">Placeholder for Graph</div>
            </div>
        </div>
    );
}



