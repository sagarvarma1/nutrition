from twilio.rest import Client
from datetime import datetime

class SummaryService:
    def __init__(self):
        self.twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    def generate_daily_summary(self, user_id):
        # Get user's daily data
        nutrition_data = self.get_daily_nutrition(user_id)
        workout_data = self.get_daily_workouts(user_id)
        
        # Generate summary using Gemini
        prompt = f"""
        Create a daily summary for user with:
        Nutrition: {nutrition_data}
        Workouts: {workout_data}
        Include personalized tips for improvement.
        """
        
        response = model.generate_content(prompt)
        return response.text

    def send_summary(self, user_id, summary):
        user = self.get_user(user_id)
        message = self.twilio_client.messages.create(
            body=summary,
            from_=TWILIO_PHONE_NUMBER,
            to=user['phone_number']
        )
        return message.sid