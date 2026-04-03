from flask import Flask, request, jsonify, send_from_directory, render_template_string
from supabase import create_client
from flask_cors import CORS
import requests
import os


app = Flask(__name__, static_url_path='', static_folder='../') # serve files from parent directory
CORS(app, supports_credentials=True)

API_KEY = "047b8248ef625a2e3ff7e6902949dca9"

SUPABASE_URL = "https://ooqtgumhyojfnxsuussh.supabase.co"
SUPABASE_KEY = "sb_publishable_yaPNGbTC9mtZMRqj_fokoQ_hmynNmpm"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json or {}

        if not data.get('email') or not data.get('password'):
            return jsonify({"success": False, "message": "Email and password are required"}), 400

        res = supabase.table("users").select("*") \
            .eq("email", data['email']) \
            .eq("password", data['password']) \
            .execute()

        user = res.data[0] if res.data else None

        if user:
            return jsonify({
                "success": True,
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "role": user["role"]
                }
            })

        return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"success": False, "message": "Backend login error", "detail": str(e)}), 500

# ---------------- REGISTER ----------------
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    supabase.table("users").insert({
        "name": data['name'],
        "email": data['email'],
        "password": data['password']
    }).execute()

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

    supabase.table("policies").insert({
        "user_id": data['user_id'],
        "plan": data['plan'],
        "premium": data['premium']
    }).execute()

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

    supabase.table("claims").insert({
        "user_id": data['user_id'],
        "amount": data['amount'],
        "status": "PAID"
    }).execute()

    return jsonify({"success": True})

# ---------------- DASHBOARD ----------------
@app.route('/dashboard', methods=['GET'])
def dashboard():
    user_id = request.args.get("user_id")
    role = request.args.get("role")

    if role == "admin":
        users = supabase.table("users").select("*", count="exact").execute()
        policies = supabase.table("policies").select("*", count="exact").execute()
        claims = supabase.table("claims").select("amount").execute()

        total_payout = sum([c["amount"] for c in claims.data]) if claims.data else 0

        return jsonify({
            "users": users.count,
            "policies": policies.count,
            "payout": total_payout
        })

    else:
        policies = supabase.table("policies") \
            .select("*", count="exact") \
            .eq("user_id", user_id).execute()

        claims = supabase.table("claims") \
            .select("*", count="exact") \
            .eq("user_id", user_id).execute()

        payout = supabase.table("claims") \
            .select("amount") \
            .eq("user_id", user_id).execute()

        total_payout = sum([c["amount"] for c in payout.data]) if payout.data else 0

        return jsonify({
            "policies": policies.count,
            "claims": claims.count,
            "payout": total_payout
        })
@app.route('/my-policy')
def my_policy():
    user_id = request.args.get("user_id")

    res = supabase.table("policies") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(1) \
        .execute()

    return jsonify(res.data[0] if res.data else {})
@app.route('/my-activity')
def my_activity():
    try:
        user_id = request.args.get("user_id")

        policies = supabase.table("policies") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()

        claims = supabase.table("claims") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()

        activity = []

        for p in policies.data or []:
            activity.append({
                "type": "policy",
                "created_at": p.get("created_at")
            })

        for c in claims.data or []:
            activity.append({
                "type": "claim",
                "created_at": c.get("created_at")
            })

        activity.sort(key=lambda x: x["created_at"] or "", reverse=True)

        return jsonify(activity[:10])

    except Exception as e:
        print("ERROR in /my-activity:", str(e))
        return jsonify({"error": str(e)}), 500
@app.route('/my-claims')
def my_claims():
    user_id = request.args.get("user_id")

    res = supabase.table("claims") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    return jsonify(res.data)

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

# ----------- MONTHLY STATS -----------

@app.route('/stats/monthly')
def monthly_stats():
    try:
        policies = supabase.table("policies").select("*").execute()
        claims = supabase.table("claims").select("*").execute()

        premium_map = {i: 0 for i in range(1, 13)}
        payout_map = {i: 0 for i in range(1, 13)}

        # premiums
        for p in policies.data or []:
            if p.get("created_at"):
                month = int(p["created_at"][5:7])
                premium_map[month] += float(p.get("premium", 0))

        # payouts
        for c in claims.data or []:
            if c.get("created_at"):
                month = int(c["created_at"][5:7])
                payout_map[month] += float(c.get("amount", 0))

        premiums = [{"month": m, "total": premium_map[m]} for m in range(1, 13)]
        payouts = [{"month": m, "total": payout_map[m]} for m in range(1, 13)]

        return jsonify({
            "premiums": premiums,
            "payouts": payouts
        })

    except Exception as e:
        print("ERROR in /stats/monthly:", str(e))  # 👈 VERY IMPORTANT
        return jsonify({"error": str(e)}), 500
@app.route('/')
def home():
    return send_from_directory('../', 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)