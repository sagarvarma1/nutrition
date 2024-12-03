import React, { useState } from 'react';
import { useNutrition } from '../../../hooks/useNutrition';
import PhotoUpload from '../../PhotoUpload';

function FoodSearch({ onAddFood }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [mealType, setMealType] = useState('breakfast');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const { analyzeMeal } = useNutrition();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const nutritionData = await analyzeMeal({
                description: searchTerm,
                mealType,
                photoUrl
            });

            onAddFood({
                ...nutritionData,
                mealType,
                description: searchTerm,
                photoUrl,
                timestamp: new Date().toISOString()
            });

            // Reset form
            setSearchTerm('');
            setPhotoUrl(null);
        } catch (err) {
            setError('Failed to analyze meal. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="food-search">
            <h3>Add Food</h3>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="search-form">
                <div className="form-group">
                    <label>Meal Type</label>
                    <select 
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                        className="meal-type-select"
                    >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Food Description</label>
                    <textarea
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Describe your meal (e.g., '2 eggs with whole wheat toast and avocado')"
                        className="food-input"
                    />
                </div>

                <PhotoUpload onUploadComplete={setPhotoUrl} />

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading || !searchTerm.trim()}
                >
                    {loading ? 'Analyzing...' : 'Add Food'}
                </button>
            </form>
        </div>
    );
}

export default FoodSearch;