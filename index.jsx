import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">NutritionTracker</Link>
            </div>
            
            <div className="navbar-menu">
                <Link to="/" className="nav-item">Dashboard</Link>
                <Link to="/tracker" className="nav-item">Track Food</Link>
                <Link to="/meal-planner" className="nav-item">Meal Planner</Link>
            </div>

            <div className="navbar-end">
                <div className="profile-menu">
                    <Link to="/profile" className="nav-item">
                        {user.username}
                    </Link>
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;