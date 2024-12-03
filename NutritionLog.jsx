import React from 'react';
import { format } from 'date-fns';

function NutritionLog({ items }) {
    const groupByMealType = (items) => {
        return items.reduce((acc, item) => {
            if (!acc[item.mealType]) {
                acc[item.mealType] = [];
            }
            acc[item.mealType].push(item);
            return acc;
        }, {});
    };

    const groupedItems = groupByMealType(items);
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    return (
        <div className="nutrition-log">
            <h3>Today's Log</h3>
            
            {mealTypes.map(mealType => (
                <div key={mealType} className="meal-section">
                    <h4>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
                    
                    {groupedItems[mealType]?.length ? (
                        <div className="meal-items">
                            {groupedItems[mealType].map((item, index) => (
                                <div key={index} className="food-item">
                                    <div className="food-item-header">
                                        <span className="time">
                                            {format(new Date(item.timestamp), 'h:mm a')}
                                        </span>
                                        <span className="calories">
                                            {item.calories} cal
                                        </span>
                                    </div>
                                    
                                    <div className="food-description">
                                        {item.description}
                                    </div>
                                    
                                    {item.photoUrl && (
                                        <img 
                                            src={item.photoUrl} 
                                            alt="Meal photo" 
                                            className="food-photo"
                                        />
                                    )}
                                    
                                    <div className="nutrition-details">
                                        <span>Protein: {item.protein}g</span>
                                        <span>Carbs: {item.carbs}g</span>
                                        <span>Fat: {item.fat}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-items">No items logged</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default NutritionLog;