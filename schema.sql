CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    fitness_goal ENUM('weight_loss', 'muscle_gain', 'maintenance') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
    meal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    meal_type VARCHAR(20),
    meal_photo_url VARCHAR(255),
    calories INT,
    protein FLOAT,
    carbs FLOAT,
    fats FLOAT,
    meal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE workouts (
    workout_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    workout_type VARCHAR(50),
    duration INT,
    calories_burned INT,
    workout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE daily_goals (
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    calorie_goal INT,
    protein_goal INT,
    carbs_goal INT,
    fats_goal INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE meal_photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    meal_id INT,
    photo_url VARCHAR(255),
    FOREIGN KEY (meal_id) REFERENCES meals(meal_id)
);