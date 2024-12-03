import React, { useState } from 'react';

function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add API call to /api/login endpoint
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Email"
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
            <input 
                type="password" 
                placeholder="Password"
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <button type="submit">Login</button>
        </form>
    );
}