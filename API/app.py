import firebase_admin
import datetime
import bcrypt
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, auth, db

# Initialize Firebase Admin SDK
cred_path = os.path.join(os.path.dirname(__file__), "Credentials/serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://train-tracker-app-default-rtdb.firebaseio.com/'
})

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Password Hashing Functions
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def check_password(hashed_password, input_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))


# Signup API Endpoint
@app.route('/signup', methods=['POST'])
def register():
    try:
        data = request.json

        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        phone_number = data.get("phone_number")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        # Create user in Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password,
            phone_number=phone_number
        )

        # Hash the password
        hashed_password = hash_password(password)

        # Prepare user data
        user_data = {
            "UserId": user.uid,
            "UserType": "StandardUser",
            "FirstName": first_name,
            "LastName": last_name,
            "Username": email,
            "PhoneNumber": phone_number,
            "Password": hashed_password,  # Store hashed password
            "CreatedOn": str(datetime.datetime.now()),
            "CreatedBy": "System"
        }

        # Save user data in Realtime Database
        db.reference("Users").child(user.uid).set(user_data)

        return jsonify({"message": "User registered successfully!", "UserId": user.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Login API Endpoint
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Authenticate user via Firebase Authentication
        user = auth.get_user_by_email(email)

        # Get user details from Realtime Database
        user_data = db.reference("Users").child(user.uid).get()

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Verify password
        if not check_password(user_data["Password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate authentication token
        token = auth.create_custom_token(user.uid)

        return jsonify({
            "message": "Login successful!",
            "UserId": user.uid,
            "UserType": user_data.get("UserType", "StandardUser"),
            "token": token.decode("utf-8")
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = db.reference("Users").get()
        if users:
            return jsonify(users), 200
        return jsonify({"message": "No users found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#  Add Train Record
@app.route('/addTrainRecord', methods=['POST'])
def add_train_record():
    try:
        data = request.json
        train_ref = db.reference("TrainRecords").push()  # Generate unique train record ID
        train_id = train_ref.key  

        train_record = {
            "TrainId": train_id,
            "Date": data.get("Date"),
            "TrainName": data.get("TrainName"),
            "FromDestination": data.get("FromDestination"),
            "ToDestination": data.get("ToDestination"),
            "ScheduledTime": data.get("ScheduledTime"),
            "DelayTime": data.get("DelayTime"),
            "CreatedOn": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save train record
        train_ref.set(train_record)

        return jsonify({"message": "Train record added successfully", "TrainId": train_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#  Update Train Record
@app.route("/updateTrainRecord/<train_id>", methods=["PUT"])
def update_train_record(train_id):
    try:
        data = request.json

        updated_record = {
            "Date": data.get("Date"),
            "TrainName": data.get("TrainName"),
            "FromDestination": data.get("FromDestination"),
            "ToDestination": data.get("ToDestination"),
            "ScheduledTime": data.get("ScheduledTime"),
            "DelayTime": data.get("DelayTime"),
            "UpdatedOn": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Update in Firebase Realtime Database
        db.reference("TrainRecords").child(train_id).update(updated_record)

        return jsonify({"message": "Train record updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Train Record
@app.route("/deleteTrainRecord/<train_id>", methods=["DELETE"])
def delete_train_record(train_id):
    try:
        train_ref = db.reference("TrainRecords").child(train_id)

        # Check if the record exists
        if not train_ref.get():
            return jsonify({"error": "Record not found"}), 404

        # Delete from Firebase Realtime Database
        train_ref.delete()

        return jsonify({"message": "Train record deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get a specific train record by ID
@app.route("/getTrainRecordById/<train_id>", methods=["GET"])
def get_train_record_by_id(train_id):
    try:
        train_record = db.reference("TrainRecords").child(train_id).get()

        if not train_record:
            return jsonify({"error": "Record not found"}), 404

        return jsonify({"data": train_record}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Train Records
@app.route("/getAllTrainRecords", methods=["GET"])
def get_all_train_records():
    try:
        train_records = db.reference("TrainRecords").get()

        if not train_records:
            return jsonify({"message": "No train records found", "data": []}), 200

        return jsonify({"message": "Train records retrieved successfully", "data": train_records}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run Flask
if __name__ == "__main__":
    app.run(debug=True, port=3000)
