from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import nutrition_service, auth_service
from app.schemas.nutrition import MealCreate, MealResponse, NutritionGoals
from typing import List

router = APIRouter()

@router.post("/meals", response_model=MealResponse)
async def create_meal(
    meal: MealCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(auth_service.get_current_user)
):
    return await nutrition_service.create_meal(db, meal, current_user.id)

@router.get("/meals", response_model=List[MealResponse])
async def get_meals(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(auth_service.get_current_user)
):
    return await nutrition_service.get_user_meals(db, current_user.id)

@router.get("/nutrition-goals", response_model=NutritionGoals)
async def get_nutrition_goals(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(auth_service.get_current_user)
):
    return await nutrition_service.get_nutrition_goals(db, current_user.id)

@router.put("/nutrition-goals", response_model=NutritionGoals)
async def update_nutrition_goals(
    goals: NutritionGoals,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(auth_service.get_current_user)
):
    return await nutrition_service.update_nutrition_goals(db, current_user.id, goals)