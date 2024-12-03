const API_BASE_URL = 'http://localhost:8000/api';

export const nutritionService = {
    async analyzeMeal(mealDescription) {
        const response = await fetch(`${API_BASE_URL}/analyze-nutrition`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ meal: mealDescription }),
        });
        return response.json();
    },
    
    async getDailySummary(userId) {
        const response = await fetch(`${API_BASE_URL}/nutrition-summary/${userId}`);
        return response.json();
    }
};

export const authService = {
    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    }
};