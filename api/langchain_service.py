from flask import Flask, request, jsonify, session
from flask_cors import CORS
from datetime import timedelta
import os
import uuid

app = Flask(__name__)
app.secret_key = "NullObjects_Secret_Key_Demek"
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {".txt", ".doc", ".docx", ".pdf"}

@app.route("/start_session", methods=["POST"])
def start_session():
    print("hello")
    session["session_id"] = str(uuid.uuid4())
    print(session.get("session_id"))
    return jsonify({"message": "Session Started", "session_id": session["session_id"]}), 200

@app.route("/get_session", methods=["GET"])
def get_session():
    session_id = session.get("session_id")
    print("Get session")
    print(session_id)
    if session_id:
        return jsonify({"message": "Session Data", "session_id": session_id}), 200
    else:
        return jsonify({"message": "No Session Found"}), 200

@app.route("/upload", methods=["POST"])
def upload():
    session_id = session.get("session_id")
    print("whar")
    print(session_id)
    print("yrea")
    if session_id:
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]
        print(file)
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        
        if not file.filename.endswith(ALLOWED_EXTENSIONS):
            print("debugovic")
            return jsonify({"error": "Bad File Extension"}), 400
        print("debugovic2")
    else:
        return jsonify({"message": "No Session Found"}), 404

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)

#qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

#document_text = ""

#@app.route("/upload", methods=["POST"])
#def upload_document():
#    global document_text
#    file = request.files["file"]
#    document_text = file.read().decode("utf-8")
#    return "Document uploaded and text extracted.", 200


#@app.route("/ask", methods=["GET"])
#def ask_question():
#    global document_text
#    question = request.args.get("question")
#    if not document_text:
#        return "No document uploaded.", 400

    # Use the pipeline to get the answer
#    result = qa_pipeline(question=question, context=document_text)
#    return jsonify(result), 200


#if __name__ == "__main__":
#    app.run(host="127.0.0.1", port=5000)
