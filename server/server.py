from flask import Flask, request, jsonify
from flask_login import UserMixin
from flask_cors import CORS
import json
import os

app = Flask(__name__)
cors = CORS(app)

json_f = open('./server/dummydata.json')
tutors = json.load(json_f)["tutors"]
json_f.close()
favorites = {"1234": tutors}
users = []


@app.route("/tutors", methods=['GET', 'POST'])
def all_tutors():
    id = request.args.get('id')
    if id:
        for tutor in tutors:
            if tutor["id"] == id:
                return tutor
    return tutors


@app.route("/favorites", methods=['GET', 'POST'])
def favorites():
    id = request.args.get('user_id')
    if id in favorites:
        return favorites[id]
    return "You currently have no favorites"


@app.route("/signup", methods=['POST'])
def signup():
    fname = request.args.get('fname')
    lname = request.args.get('lname')
    email = request.args.get('email')
    password = request.args.get('pass')
    is_tutor = request.args.get('is_tutor')


if __name__ == '__main__':
    app.run(debug=True)
