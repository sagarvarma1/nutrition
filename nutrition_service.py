from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime, date
from app.models.meal import Meal
from app.models.user import User
from app.schemas.nutrition import MealCreate, NutritionGoals
from fastapi import HTTPException
from typing import List

async def create_meal(db: AsyncSession, meal: MealCreate, user_id: int) -> Meal:
    db_meal = Meal(
        user_id=user_id,
        description=meal.description,
        meal_type=meal.meal_type,
        calories=meal.calories,
        protein=meal.protein,
        carbs=meal.carbs,
        fat=meal.fat,
        photo_url=meal.photo_url
    )
    
    db.add(db_meal)
    await db.commit()
    await db.refresh(db_meal)
    return db_meal

async def get_user_meals(
    db: AsyncSession, 
    user_id: int, 
    date_filter: date = None
) -> List[Meal]:
    query = select(Meal).filter(Meal.user_id == user_id)
    
    if date_filter:
        query = query.filter(func.date(Meal.created_at) == date_filter)
    
    result = await db.execute(query)
    return result.scalars().all()

async def get_nutrition_goals(db: AsyncSession, user_id: int) -> NutritionGoals:
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return NutritionGoals(
        calories=user.daily_calorie_goal,
        protein=user.daily_protein_goal,
        carbs=user.daily_carbs_goal,
        fat=user.daily_fat_goal
    )

async def update_nutrition_goals(
    db: AsyncSession, 
    user_id: int, 
    goals: NutritionGoals
) -> NutritionGoals:
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.daily_calorie_goal = goals.calories
    user.daily_protein_goal = goals.protein
    user.daily_carbs_goal = goals.carbs
    user.daily_fat_goal = goals.fat
    
    await db.commit()
    return goals