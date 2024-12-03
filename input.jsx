import React from 'react';
import './Input.css';

function Input({
    type = 'text',
    label,
    error,
    id,
    className = '',
    ...props
}) {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                className={`input ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}

export default Input;