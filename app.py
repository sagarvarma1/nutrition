from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import Dict, Optional
import vertexai
from vertexai.generative_models import GenerativeModel
from datetime import datetime
import os
from dotenv import load_dotenv
from passlib.hash import bcrypt
from jose import JWTError, jwt
import secrets
import time
from datetime import timedelta

SECRET_KEY = secrets.token_urlsafe(32)
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

# Initialize Gemini
vertexai.init(
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location="us-central1"
)
model = GenerativeModel("gemini-pro")

class MealInput(BaseModel):
    meal: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def parse_nutrition_from_gemini(response: str) -> Dict:
    """Parse Gemini's response into structured nutrition data"""
    try:
        # This is a simple example - you'll need to adjust based on actual Gemini response format
        nutrition_data = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "sugar": 0,
            "sodium": 0
        }
        
        # Parse the response text and extract nutrition values
        # This is placeholder logic - adjust based on actual response format
        lines = response.split('\n')
        for line in lines:
            if 'calories:' in line.lower():
                nutrition_data['calories'] = float(line.split(':')[1].strip())
            # Add similar parsing for other nutrients
            
        return nutrition_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse nutrition data: {str(e)}")

@app.post("/api/analyze-nutrition")
async def analyze_nutrition(meal_input: MealInput):
    try:
        # Generate prompt for Gemini
        prompt = f"""
        Analyze the following meal and provide detailed nutritional information:
        {meal_input.meal}
        
        Please provide:
        - Total calories
        - Protein (g)
        - Carbohydrates (g)
        - Fat (g)
        - Fiber (g)
        - Sugar (g)
        - Sodium (mg)
        """
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        
        # Parse the response
        nutrition_data = parse_nutrition_from_gemini(response.text)
        
        # Store in database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO meals (user_id, meal_description, calories, protein, carbs, fats, fiber, sugar, sodium)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            1,  # Replace with actual user_id from auth
            meal_input.meal,
            nutrition_data['calories'],
            nutrition_data['protein'],
            nutrition_data['carbs'],
            nutrition_data['fat'],
            nutrition_data['fiber'],
            nutrition_data['sugar'],
            nutrition_data['sodium']
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return nutrition_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    
@app.post("/api/register")
async def register(user_data: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        hashed_password = bcrypt.hash(user_data.password)
        cursor.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
        """, (user_data.username, user_data.email, hashed_password))
        
        conn.commit()
        return {"message": "User registered successfully"}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    finally:
        cursor.close()
        conn.close()

@app.post("/api/login")
async def login(user_credentials: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_credentials.email,))
        user = cursor.fetchone()
        
        if not user or not bcrypt.verify(user_credentials.password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        
        access_token = create_access_token({"sub": str(user['user_id'])})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user['user_id'],
            "username": user['username']
        }
    finally:
        cursor.close()
        conn.close()

@app.get("/api/user-nutrition/{user_id}")
async def get_user_nutrition(user_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT * FROM meals 
            WHERE user_id = %s 
            AND DATE(meal_date) = CURDATE()
        """, (user_id,))
        
        meals = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return meals
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/nutrition-summary/{user_id}")
async def get_nutrition_summary(user_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT 
                SUM(calories) as total_calories,
                SUM(protein) as total_protein,
                SUM(carbs) as total_carbs,
                SUM(fats) as total_fats
            FROM meals 
            WHERE user_id = %s 
            AND DATE(meal_date) = CURDATE()
        """, (user_id,))
        
        summary = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)