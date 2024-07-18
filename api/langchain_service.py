from flask import Flask, request, jsonify, session, make_response
from flask_cors import CORS
from datetime import timedelta
from werkzeug.utils import secure_filename
import os
import uuid
import shutil
import jwt
import datetime
from chatbot import Chatbot

chatbot = Chatbot("deepset/tinyroberta-squad2")

UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, "uploads")

JWT_SECRET_KEY = "NullObjects_Secret_Key_Demek"
JWT_EXPIRATION_DELTA = timedelta(minutes=180)

ALLOWED_EXTENSIONS = (".txt", ".doc", ".docx", ".pdf")

app = Flask(__name__)
app.secret_key = JWT_SECRET_KEY
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60*3)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_EXPIRATION_DELTA"] = JWT_EXPIRATION_DELTA
CORS(app, origins="http://localhost:3000", supports_credentials=True)

shutil.rmtree(UPLOAD_FOLDER)
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def GenerateJWTtoken(session_id):
    payload = {
        'session_id': session_id,
        'exp': datetime.datetime.now(datetime.UTC) + JWT_EXPIRATION_DELTA
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

def VerifyJWTtoken(token):
    if not token:
        return None

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['session_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route("/start_session", methods=["POST"])
def start_session():
    session["session_id"] = str(uuid.uuid4())
    token = GenerateJWTtoken(session["session_id"])
    session.modified = True
    response = make_response(jsonify({"message": "Session Started"}))
    response.set_cookie('jwt_token', token, httponly=True, secure=True)
    return response, 200

@app.route("/check_session", methods=["GET"])
def check_session():
    token = request.cookies.get('jwt_token')

    if not VerifyJWTtoken(token):
        return jsonify({"message": "Invalid token"}), 200

    return jsonify({"message": "Token is valid"}), 200

@app.route("/upload", methods=["POST"])
def upload():
    token = request.cookies.get('jwt_token')

    if not VerifyJWTtoken(token):
        return jsonify({"error": "Invalid token"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        return jsonify({"error": "Bad File Extension"}), 400

    try:
        filename = secure_filename(session["session_id"])
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({"message": "File uploaded successfully", "filename": filename}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask_question", methods=["POST"])
def ask_question():
    token = request.cookies.get("jwt_token")
    
    if not VerifyJWTtoken(token):
        return jsonify({"error": "Invalid token"}), 401
    
    question = request.data.decode('utf-8')
    
    if isinstance(question, str):
        with open(os.path.join(UPLOAD_FOLDER, session["filename"])) as file:
            try:
                return jsonify({"message": chatbot.GenerateAnswer(question, file)}), 200
            except any:
                return jsonify({"error": "Couldn't generate answer!"}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)