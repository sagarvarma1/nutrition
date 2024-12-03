import React from 'react';
import './Button.css';

function Button({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    fullWidth = false,
    className = ''
}) {
    const classes = `
        button 
        button-${variant} 
        button-${size}
        ${fullWidth ? 'button-full-width' : ''}
        ${loading ? 'button-loading' : ''}
        ${className}
    `;

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <span className="loading-spinner"></span>
            ) : children}
        </button>
    );
}

export default Button;