import React, { useState } from 'react';

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        fitness_goal: 'maintenance'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        // Add redirect on success
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" 
                onChange={(e) => setUserData({...userData, username: e.target.value})} />
            <input type="email" placeholder="Email" 
                onChange={(e) => setUserData({...userData, email: e.target.value})} />
            <input type="password" placeholder="Password" 
                onChange={(e) => setUserData({...userData, password: e.target.value})} />
            <select onChange={(e) => setUserData({...userData, fitness_goal: e.target.value})}>
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
            </select>
            <button type="submit">Register</button>
        </form>
    );
}