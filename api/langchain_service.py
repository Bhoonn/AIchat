from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load the question-answering pipeline
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

document_text = ""


@app.route("/upload", methods=["POST"])
def upload_document():
    global document_text
    file = request.files['file']
    document_text = file.read().decode('utf-8')
    return "Document uploaded and text extracted.", 200


@app.route("/ask", methods=["GET"])
def ask_question():
    global document_text
    question = request.args.get("question")
    if not document_text:
        return "No document uploaded.", 400

    # Use the pipeline to get the answer
    result = qa_pipeline(question=question, context=document_text)
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
