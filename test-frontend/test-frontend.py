#!/usr/bin/env python3

import json
with open('../config.json') as f:
    config = json.load(f)

import requests
# Ayuda en https://requests.readthedocs.io/es/latest/

server_url= "http://"+config['server_address']+":"+ str(config['server_port']) 

def getToken():
    headers = { 
      'username': 'user',
      'password': 'secret'
    }
    r = requests.post(server_url + '/api/sign_in',headers=headers)
    data = r.json()
    return data['Authorization']

def getMessage(token): 
    headers= { 'Authorization': token }   
    r = requests.get(server_url + '/api/message',headers=headers)   
    data = r.json()
    return data

# Programa principal

if __name__ == "__main__":
    print("Python test frontend")
    token=getToken()
    print("The token is:", token)
    print(getMessage(token))
 