# We implement jwt using Flask-JWT-Extended
# https://flask-jwt-extended.readthedocs.io/en/stable/basic_usage/
# https://github.com/vimalloc/flask-jwt-extended
# License: MIT

import json

with open('../config.json') as f:
    config = json.load(f)

from flask import Flask, jsonify, request
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,
                                get_jwt_identity)
#from flask_cors import CORS

app = Flask(__name__)
#CORS(app)

# Setup the Flask-JWT-Extended extension
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)

# Provide a method to create access tokens. The create_access_token()
# function is used to actually generate the token, and you can return
# it to the caller however you choose.


@app.route('/api/sign_in', methods=['POST'])
def sign_in():
    print("Method sign_in called.")
    username = request.headers['username']
    password = request.headers['password']
    #print("username=", username)
    #print("password=", password)
    if not username:
        return jsonify({"statusMessage": "Missing username parameter"}), 400
    if not password:
        return jsonify({"statusMessage": "Missing password parameter"}), 400

    if username != 'user' or password != 'secret':
        return jsonify({"statusMessage": "Bad username or password"}), 401

    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=username)
    return jsonify({
        "statusMessage": "Sucesfully Logged in",
        "AuthToken": access_token
    }), 200


@app.route('/', methods=['GET'])
def home():
    return "Servidor escuchando el puerto " + str(
        config['server_port']) + " en " + config['server_address']


@app.route('/hello', methods=['GET'])
def hello():
    return "Hola mundo!"


# Protect a view with jwt_required, which requires a valid access token
# in the request to access.
@app.route('/message', methods=['GET'])
@jwt_required
def message():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.after_request
def after_request_func(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    print(response.data)
    return response


if __name__ == '__main__':
    print("Vue.js login example - Python backend.")
    app.run(host=config['server_address'], port=config['server_port'])
