from flask import Flask, request, jsonify, send_from_directory, render_template_string
import mysql.connector
from flask_cors import CORS
import requests
import os


app = Flask(__name__, static_url_path='', static_folder='../') # serve files from parent directory
CORS(app)

API_KEY = "047b8248ef625a2e3ff7e6902949dca9"

# DB connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Akisn277",
        database="gigguardian"
    )

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (data['email'], data['password'])
    )

    user = cursor.fetchone()

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "role": user["role"]
            }
        })
    else:
        return jsonify({"success": False})

# ---------------- REGISTER ----------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
                   (data['name'], data['email'], data['password']))
    db.commit()

    return jsonify({"success": True})

# ---------------- ALL POLICIES (protected) ----------------
@app.route('/all-policies')
def all_policies():
    role = request.args.get("role")

    if role != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM policies")
    policies = cursor.fetchall()

    return jsonify({"success": True, "policies": policies})

# ---------------- CREATE POLICY ----------------
@app.route('/create-policy', methods=['POST'])
def create_policy():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    cursor.execute("INSERT INTO policies (user_id, plan, premium) VALUES (%s,%s,%s)",
                   (data['user_id'], data['plan'], data['premium']))
    db.commit()

    return jsonify({"success": True})

# ---------------- MOCK TRIGGER ----------------
@app.route('/trigger', methods=['GET'])
def trigger():
    city = request.args.get("city", "Mumbai")

    # 🌧 WEATHER DATA
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    weather_res = requests.get(weather_url).json()

    temp = weather_res["main"]["temp"]

    # rain may not exist
    rain = 0
    if "rain" in weather_res and "1h" in weather_res["rain"]:
        rain = weather_res["rain"]["1h"]

    # 🌫 AQI DATA
    lat = weather_res["coord"]["lat"]
    lon = weather_res["coord"]["lon"]

    aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    aqi_res = requests.get(aqi_url).json()

    aqi_raw = aqi_res["list"][0]["main"]["aqi"]
    aqi = aqi_raw * 50  # scale to realistic number

    # 🚨 EVENTS
    events = [
        {
            "type": "rain",
            "value": rain if rain > 0 else 60,  # fallback for demo
            "threshold": 50,
            "zone": city
        },
        {
            "type": "heat",
            "value": temp,
            "threshold": 45,
            "zone": city
        },
        {
            "type": "aqi",
            "value": aqi,
            "threshold": 150,
            "zone": city
        }
    ]

    return jsonify({"events": events})

# ---------------- AUTO CLAIM ----------------
@app.route('/auto-claim', methods=['POST'])
def auto_claim():
    data = request.json

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO claims (user_id, amount, status) VALUES (%s,%s,%s)",
        (data['user_id'], data['amount'], "PAID")
    )

    db.commit()

    return jsonify({"success": True})

# ---------------- DASHBOARD ----------------
@app.route('/dashboard', methods=['GET'])
def dashboard():
    user_id = request.args.get("user_id")
    role = request.args.get("role")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    if role == "admin":
        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        users = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) as total_policies FROM policies")
        policies = cursor.fetchone()

        cursor.execute("SELECT SUM(amount) as total_payout FROM claims")
        payouts = cursor.fetchone()

        return jsonify({
            "users": users["total_users"],
            "policies": policies["total_policies"],
            "payout": payouts["total_payout"] or 0
        })
    else:
        cursor.execute("SELECT COUNT(*) as my_policies FROM policies WHERE user_id=%s", (user_id,))
        policies = cursor.fetchone()

        cursor.execute("SELECT COUNT(*) as my_claims FROM claims WHERE user_id=%s", (user_id,))
        claims = cursor.fetchone()

        cursor.execute("SELECT SUM(amount) as my_payout FROM claims WHERE user_id=%s", (user_id,))
        payout = cursor.fetchone()

        return jsonify({
            "policies": policies["my_policies"],
            "claims": claims["my_claims"],
            "payout": payout["my_payout"] or 0
        })

@app.route('/my-policy')
def my_policy():
    user_id = request.args.get("user_id")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM policies WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )

    policy = cursor.fetchone()

    return jsonify(policy if policy else {})

@app.route('/my-activity')
def my_activity():
    user_id = request.args.get("user_id")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 'policy' as type, created_at 
        FROM policies WHERE user_id=%s

        UNION ALL

        SELECT 'claim' as type, created_at 
        FROM claims WHERE user_id=%s

        ORDER BY created_at DESC LIMIT 5
    """, (user_id, user_id))

    return jsonify(cursor.fetchall())

@app.route('/my-claims')
def my_claims():
    user_id = request.args.get("user_id")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM claims WHERE user_id=%s", (user_id,))
    return jsonify(cursor.fetchall())

@app.route("/check-fraud", methods=["POST"])
def check_fraud():
    data = request.json
    
    # simple fake rule
    if data["claims_today"] > 3:
        return jsonify({"fraud": True})
    
    return jsonify({"fraud": False})

@app.route("/risk")
def risk():
    return jsonify({"score": 0.78})

@app.route('/')
def home():
    return send_from_directory('../', 'index.html')
if __name__ == '__main__':
    app.run(debug=True)