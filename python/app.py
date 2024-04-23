from flask import Flask, request, session, jsonify
from pymongo import MongoClient
import bcrypt
from flask_cors import CORS
app = Flask(__name__)
app.secret_key = "testing"
CORS(app)
def MongoDB():
    client = MongoClient("mongodb+srv://proxolo:7QYf1BDXuMlJ5y1Q@proxolo.yllmdjv.mongodb.net/?retryWrites=true&w=majority")
    db = client.get_database('total_records')
    records = db.register
    return records

records = MongoDB()

@app.route("/", methods=['POST', 'GET'])
def index():
    print(request.json)
    response = {}
    if "email" in session:
        response["message"] = "User already logged in"
        response["status"] = "false"
        return jsonify(response)
    
    if request.method == "POST":
        print(request.json)
        firstName = request.json.get("first_name")
        lastName = request.json.get("last_name")
        email = request.json.get("email")
        password1 = request.json.get("password")

        user_found = records.find_one({"firstName": firstName})
        email_found = records.find_one({"email": email})

        if user_found:
            response["name"] = firstName
            response["message"] = 'There already is a user by that name'
            response["status"] = "false"
        elif email_found:
            response["name"] = firstName
            response["message"] = 'This email already exists in database'
            response["status"] = "false"
        else:
            hashed = bcrypt.hashpw(password1.encode('utf-8'), bcrypt.gensalt())
            user_input = {'firstName': firstName, 'lastName': lastName, 'email': email, 'password': hashed}
            records.insert_one(user_input)
            response["name"] = firstName
            response["message"] = 'Registration successful'
            response["status"] = "200"
            
    return jsonify(response)

@app.route("/login", methods=["POST", "GET"])
def login():
    response = {}
    if "email" in session:
        response["message"] = "User already logged in"
        response["status"] = "200"
        return jsonify(response)

    if request.method == "POST":
        email = request.json.get("email")
        password = request.json.get("password")

        email_found = records.find_one({"email": email})
        
        if email_found:
            email_val = email_found['email']
            passwordcheck = email_found['password']
            if bcrypt.checkpw(password.encode('utf-8'), passwordcheck):
                session["email"] = email_val
                response["name"] = email_found['firstName']
                response["message"] = 'Login successful'
                response["status"] = "200"
            else:
                response["message"] = 'Wrong password'
                response["status"] = "false"
        else:
            response["message"] = 'Email not found'
            response["status"] = "false"
            
    return jsonify(response)

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', port=5000)
