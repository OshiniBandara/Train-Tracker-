# Imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import datetime
import uuid  
import bcrypt


# Firebase Configuration
firebaseConfig = {
    "apiKey": "AIzaSyBpnhwt9sKPZbT4a51ZLDckmA_bGglguaI",
    "authDomain": "train-tracker-app.firebaseapp.com",
    "databaseURL": "https://train-tracker-app-default-rtdb.firebaseio.com/",
    "projectId": "train-tracker-app",
    "storageBucket": "train-tracker-app.firebasestorage.app",
    "messagingSenderId": "1043323291450",
    "appId": "1:1043323291450:web:36483fc1518ee5d360f203",
    "measurementId": "G-SJR6KB67YC"
}

# Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()

# Initialize Flask App
app = Flask(__name__)
CORS(app)


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def check_password(hashed_password, input_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))



# @app.route("/test", methods=["GET"])
# def test():
#     return jsonify({"message": "Flask API is working!"}), 200


#-----Users API Endpoints-----#

# Signup API Endpoint
@app.route('/signup', methods=['POST'])
def register():
    try:
        data = request.json

        # Get user input
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        phone_number = data.get("phone_number")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        # Validate passwords
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        # Create user in Firebase Authentication
        user = auth.create_user_with_email_and_password(email, password)
        userId = user["localId"]  # Get unique Firebase UID
        
        # Hash the password
        hashed_password = hash_password(password)

        # Prepare user data
        user_data = {
            "UserId": userId,
            "UserType": "StandardUser",
            "FirstName": first_name,
            "LastName": last_name,
            "Username": email,
            "PhoneNumber": phone_number,
            "Password": hashed_password,
            "CreatedOn": str(datetime.datetime.now()),
            "CreatedBy": "System"
        }

        # Save user in Realtime Database
        db.child("Users").child(userId).set(user_data)

        return jsonify({"message": "User registered successfully!", "UserId": userId}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Login API Endpoint
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Authenticate user with Firebase Auth
        user = auth.sign_in_with_email_and_password(email, password)
        user_id = user["localId"]

        # Get user details from Realtime Database
        user_data = db.child("Users").child(user_id).get().val()
        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Verify the hashed password
        if not check_password(user_data["Password"], password):
            return jsonify({"error": "Invalid credentials"}), 401


        # Determine redirect URL based on UserType
        user_type = user_data.get("UserType", "Standard User")
        
        return jsonify({
            "message": "Login successful!", 
            "UserType": user_type
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Get All Users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = db.child("Users").get().val()  # Get all users
        if users:
            return jsonify(users), 200
        else:
            return jsonify({"message": "No users found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

#-----Train API Endpoints-----#

# Add Train Record
@app.route('/addTrainRecord', methods=['POST'])
def add_train_record():
    try:
        data = request.json
        
        train_record = {
            "Date": data.get("Date"),
            "TrainName": data.get("TrainName"),
            "FromDestination": data.get("FromDestination"),
            "ToDestination": data.get("ToDestination"),
            "ScheduledTime": data.get("ScheduledTime"),
            "DelayTime": data.get("DelayTime"),
            "CreatedOn": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
          # Save record in Firebase Realtime Database
        db.child("TrainRecords").push(train_record)

        return jsonify({"message": "Train record added successfully", "data": train_record}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Update Train Record
@app.route("/updateTrainRecord/<record_id>", methods=["PUT"])
def update_train_record(record_id):
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

        # Update record in Firebase Realtime Database
        db.child("TrainRecords").child(record_id).update(updated_record)

        return jsonify({"message": "Train record updated successfully", "data": updated_record}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete a train record by ID
@app.route("/deleteTrainRecord/<record_id>", methods=["DELETE"])
def delete_train_record(record_id):
    try:
        ref = db.child("TrainRecords").child(record_id)
        
        # Fetch the record from Firebase to check if it exists
        record = ref.get()

        # Check if the record exists
        if record.val() is None:
            return jsonify({"error": "Record not found"}), 404

        # Delete the record from Firebase using the reference
        ref.remove() 

        return jsonify({"message": "Train record deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# Get a specific train record by ID
@app.route("/getTrainRecordById/<record_id>", methods=["GET"])
def get_train_record_by_id(record_id):
    try:
        # Reference the specific record under TrainRecords
        ref = db.child("TrainRecords").child(record_id)
        
        # Fetch the record from Firebase
        record = ref.get()
        
        # Check if the record exists
        if record.val() is None:
            return jsonify({"error": "Record not found"}), 404
        
        return jsonify({"data": record.val()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Get All Train Records
@app.route("/getAllTrainRecords", methods=["GET"])
def get_all_train_records():
    try:
        train_records = db.child("TrainRecords").get().val()

        if not train_records:
            return jsonify({"message": "No train records found"}), 404

        return jsonify({"message": "Train records retrieved successfully", "data": train_records}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

# Run Flask
if __name__ == "__main__":
    app.run(debug=True, port=3000)