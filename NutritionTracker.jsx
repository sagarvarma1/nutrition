import React, { useState } from 'react';
import './NutritionTracker.css';

const NutritionTracker = () => {
    const [mealInput, setMealInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [nutritionData, setNutritionData] = useState(null);

    const analyzeMeal = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/analyze-nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meal: mealInput }),
            });
            const data = await response.json();
            setNutritionData(data);
        } catch (error) {
            console.error('Error analyzing meal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="nutrition-tracker">
            <div className="tracker-container">
                <h1>Nutrition Tracker</h1>
                
                <form onSubmit={analyzeMeal} className="meal-form">
                    <textarea
                        value={mealInput}
                        onChange={(e) => setMealInput(e.target.value)}
                        placeholder="Describe what you ate (e.g., '2 eggs, 1 slice of whole wheat toast, 1 avocado')"
                        className="meal-input"
                    />
                    <button 
                        type="submit" 
                        className="analyze-button"
                        disabled={isLoading || !mealInput.trim()}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Meal'}
                    </button>
                </form>

                {nutritionData && (
                    <div className="nutrition-results">
                        <h2>Nutrition Breakdown</h2>
                        <div className="nutrition-cards">
                            <div className="nutrition-card">
                                <h3>Calories</h3>
                                <p>{nutritionData.calories}</p>
                            </div>
                            <div className="nutrition-card">
                                <h3>Protein</h3>
                                <p>{nutritionData.protein}g</p>
                            </div>
                            <div className="nutrition-card">
                                <h3>Carbs</h3>
                                <p>{nutritionData.carbs}g</p>
                            </div>
                            <div className="nutrition-card">
                                <h3>Fat</h3>
                                <p>{nutritionData.fat}g</p>
                            </div>
                        </div>
                        
                        <div className="nutrition-details">
                            <h3>Additional Information</h3>
                            <ul>
                                <li>Fiber: {nutritionData.fiber}g</li>
                                <li>Sugar: {nutritionData.sugar}g</li>
                                <li>Sodium: {nutritionData.sodium}mg</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NutritionTracker;