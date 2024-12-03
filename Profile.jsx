import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

function Profile() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone_number: '',
        fitness_goal: '',
        daily_calorie_goal: '',
        notification_preferences: {
            email: false,
            sms: false
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user-profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            
            const updatedUser = await response.json();
            updateUser(updatedUser);
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.username) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <h2>Profile Settings</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={profile.phone_number}
                        onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Fitness Goal</label>
                    <select
                        value={profile.fitness_goal}
                        onChange={(e) => setProfile({...profile, fitness_goal: e.target.value})}
                    >
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Daily Calorie Goal</label>
                    <input
                        type="number"
                        value={profile.daily_calorie_goal}
                        onChange={(e) => setProfile({...profile, daily_calorie_goal: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Notification Preferences</label>
                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={profile.notification_preferences.email}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    notification_preferences: {
                                        ...profile.notification_preferences,
                                        email: e.target.checked
                                    }
                                })}
                            />
                            Email Notifications
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={profile.notification_preferences.sms}
                                onChange={(e) => setProfile({
                                    ...profile,
                                    notification_preferences: {
                                        ...profile.notification_preferences,
                                        sms: e.target.checked
                                    }
                                })}
                            />
                            SMS Notifications
                        </label>
                    </div>
                </div>

                <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default Profile;