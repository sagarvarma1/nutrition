from sqlalchemy import Column, Integer, String, Enum, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    phone_number = Column(String, nullable=True)
    fitness_goal = Column(Enum('weight_loss', 'muscle_gain', 'maintenance', name='fitness_goals'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    daily_calorie_goal = Column(Integer, default=2000)
    daily_protein_goal = Column(Float, default=150)
    daily_carbs_goal = Column(Float, default=250)
    daily_fat_goal = Column(Float, default=70)