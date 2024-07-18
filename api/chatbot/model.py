from transformers import AutoTokenizer, TFAutoModelForQuestionAnswering
import tensorflow as tf

class Chatbot:
    def __init__(self, model_name):
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = TFAutoModelForQuestionAnswering.from_pretrained(model_name)

    def GenerateAnswer(self, question, context):
        inputs = self.tokenizer.encode_plus(question, context, add_special_tokens=True, return_tensors="tf")
        print(inputs)
        input_ids = inputs["input_ids"].numpy().tolist()[0]
        print(input_ids)
        outputs = self.model(inputs)
        print(outputs)
        answer_start_scores = outputs.start_logits
        answer_end_scores = outputs.end_logits

        answer_start = tf.argmax(answer_start_scores, axis=1).numpy()[0]
        answer_end = tf.argmax(answer_end_scores, axis=1).numpy()[0] + 1

        answer = self.tokenizer.convert_tokens_to_string(self.tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))

