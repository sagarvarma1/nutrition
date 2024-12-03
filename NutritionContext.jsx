import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NutritionContext = createContext(null);

export const NutritionProvider = ({ children }) => {
    const { user } = useAuth();
    const [dailyLog, setDailyLog] = useState([]);
    const [nutritionGoals, setNutritionGoals] = useState({
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 70
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchDailyLog();
            fetchNutritionGoals();
        }
    }, [user]);

    const fetchDailyLog = async () => {
        try {
            const response = await fetch('/api/daily-log', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch daily log');
            
            const data = await response.json();
            setDailyLog(data);
        } catch (err) {
            setError('Failed to load daily nutrition log');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNutritionGoals = async () => {
        try {
            const response = await fetch('/api/nutrition-goals', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch nutrition goals');
            
            const data = await response.json();
            setNutritionGoals(data);
        } catch (err) {
            console.error('Failed to load nutrition goals:', err);
        }
    };

    const addFoodItem = async (foodData) => {
        try {
            const response = await fetch('/api/log-food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(foodData)
            });

            if (!response.ok) throw new Error('Failed to log food');

            const newFood = await response.json();
            setDailyLog([...dailyLog, newFood]);
            return newFood;
        } catch (err) {
            setError('Failed to log food item');
            throw err;
        }
    };

    const updateNutritionGoals = async (newGoals) => {
        try {
            const response = await fetch('/api/nutrition-goals', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newGoals)
            });

            if (!response.ok) throw new Error('Failed to update nutrition goals');

            const updatedGoals = await response.json();
            setNutritionGoals(updatedGoals);
            return updatedGoals;
        } catch (err) {
            setError('Failed to update nutrition goals');
            throw err;
        }
    };

    const getDailyTotals = () => {
        return dailyLog.reduce((totals, item) => ({
            calories: totals.calories + (item.calories || 0),
            protein: totals.protein + (item.protein || 0),
            carbs: totals.carbs + (item.carbs || 0),
            fat: totals.fat + (item.fat || 0)
        }), {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        });
    };

    const value = {
        dailyLog,
        nutritionGoals,
        loading,
        error,
        addFoodItem,
        updateNutritionGoals,
        getDailyTotals
    };

    return (
        <NutritionContext.Provider value={value}>
            {children}
        </NutritionContext.Provider>
    );
};

export const useNutrition = () => {
    const context = useContext(NutritionContext);
    if (!context) {
        throw new Error('useNutrition must be used within a NutritionProvider');
    }
    return context;
};