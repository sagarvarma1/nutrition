import React from 'react';
import './Loading.css';

function Loading({ size = 'medium', color = 'primary' }) {
    return (
        <div className={`loading-spinner spinner-${size} spinner-${color}`}>
            <div className="spinner"></div>
        </div>
    );
}

export default Loading;