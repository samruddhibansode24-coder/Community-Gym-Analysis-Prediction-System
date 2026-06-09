"""
ML Service - Gym Website
Flask API for workout recommendations, BMI prediction, fitness suggestions
"""
import os, json, math
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'gym_dataset.csv')
df = None
try:
    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset loaded: {len(df)} records")
except Exception as e:
    print(f"Dataset not found: {e}")

def calculate_bmi(weight_kg, height_m):
    bmi = weight_kg / (height_m ** 2)
    if bmi < 18.5: category = "Underweight"
    elif bmi < 25: category = "Normal weight"
    elif bmi < 30: category = "Overweight"
    else: category = "Obese"
    return round(bmi, 2), category

def get_recommendation(bmi_category, fitness_goal, sex, hypertension=False, diabetes=False):
    if df is None: return None
    filtered = df[df['Level'].str.lower() == bmi_category.lower()]
    if filtered.empty: filtered = df.copy()
    if fitness_goal:
        gm = filtered[filtered['Fitness Goal'].str.lower().str.contains(fitness_goal.lower(), na=False)]
        if not gm.empty: filtered = gm
    if sex:
        sm = filtered[filtered['Sex'].str.lower() == sex.lower()]
        if not sm.empty: filtered = sm
    if hypertension:
        hm = filtered[filtered['Hypertension'].str.lower() == 'yes']
        if not hm.empty: filtered = hm
    if diabetes:
        dm = filtered[filtered['Diabetes'].str.lower() == 'yes']
        if not dm.empty: filtered = dm
    if filtered.empty: return None
    row = filtered.sample(1).iloc[0]
    return {
        "exercises": row.get("Exercises",""), "equipment": row.get("Equipment",""),
        "diet": row.get("Diet",""), "recommendation": row.get("Recommendation",""),
        "fitness_type": row.get("Fitness Type",""), "fitness_goal": row.get("Fitness Goal","")
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK", "dataset_loaded": df is not None})

@app.route('/api/bmi', methods=['POST'])
def bmi_prediction():
    try:
        data = request.get_json()
        weight = float(data.get('weight', 0))
        height = float(data.get('height', 0))
        if weight <= 0 or height <= 0:
            return jsonify({"success": False, "message": "Valid weight(kg) and height(m) required"}), 400
        bmi, category = calculate_bmi(weight, height)
        tips = {
            "Underweight": "Focus on strength training and caloric surplus. Eat protein-rich foods.",
            "Normal weight": "Maintain current routine. Mix cardio and strength training.",
            "Overweight": "Increase cardio sessions. Focus on a caloric deficit diet.",
            "Obese": "Start with low-impact cardio. Consult a doctor before intense exercise."
        }
        return jsonify({"success": True, "bmi": bmi, "category": category,
                        "tip": tips.get(category,""), "healthy_bmi_range": "18.5 - 24.9"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def workout_recommendation():
    try:
        data = request.get_json()
        weight = float(data.get('weight', 70))
        height = float(data.get('height', 1.70))
        sex = data.get('sex', 'Male')
        fitness_goal = data.get('fitness_goal', '')
        hypertension = bool(data.get('hypertension', False))
        diabetes = bool(data.get('diabetes', False))
        bmi, bmi_category = calculate_bmi(weight, height)
        rec = get_recommendation(bmi_category, fitness_goal, sex, hypertension, diabetes)
        if rec:
            return jsonify({"success": True, "bmi": bmi, "bmi_category": bmi_category, **rec, "source": "dataset"})
        fallback = {
            "Underweight": {"exercises": "Squats, deadlifts, bench press, overhead press, pull-ups",
                            "diet": "High protein: chicken, eggs, dairy. Complex carbs: oats, rice. +300-500 kcal/day.",
                            "equipment": "Barbells, dumbbells, pull-up bar"},
            "Normal weight": {"exercises": "Mix of cardio 30min and strength training 3x/week",
                              "diet": "Balanced macros 40% carbs, 30% protein, 30% fat.",
                              "equipment": "Treadmill, dumbbells, resistance bands"},
            "Overweight": {"exercises": "Brisk walking, cycling, HIIT 3x/week, bodyweight squats",
                           "diet": "Caloric deficit 300-500 kcal. High fiber, lean protein.",
                           "equipment": "Treadmill, stationary bike, resistance bands"},
            "Obese": {"exercises": "Low-impact: walking, swimming, chair exercises. Gradual progression.",
                      "diet": "Consult nutritionist. Reduce processed foods, increase vegetables.",
                      "equipment": "Walking shoes, resistance bands"}
        }
        fb = fallback.get(bmi_category, fallback["Normal weight"])
        return jsonify({"success": True, "bmi": bmi, "bmi_category": bmi_category,
                        "exercises": fb["exercises"], "equipment": fb["equipment"], "diet": fb["diet"],
                        "recommendation": f"Based on your BMI of {bmi} ({bmi_category}), follow a structured program. Stay hydrated and get 7-8 hours sleep.",
                        "fitness_type": "General Fitness", "fitness_goal": fitness_goal or "General Fitness", "source": "fallback"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/fitness-goals', methods=['GET'])
def fitness_goals():
    if df is not None:
        goals = df['Fitness Goal'].dropna().unique().tolist()
    else:
        goals = ["Weight Loss", "Weight Gain", "Muscle Building", "Endurance", "General Fitness"]
    return jsonify({"success": True, "goals": goals})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
