#!/usr/bin/env python3

import json
with open('../config.json') as f:
    config = json.load(f)

import requests
# Ayuda en https://requests.readthedocs.io/es/latest/

server_url= "http://"+config['server_address']+":"+ str(config['server_port']) 

def getToken():
    print("Method getToken called")
    headers = { 
      'username': 'user',
      'password': 'secret'
    }
    r = requests.post(server_url + '/api/sign_in',headers=headers)
    try:
        data = r.json()
        print("data recieved=",data)
        return data['Authorization']
    except json.JSONDecodeError as ex:
        print("Eror parsing json:",ex.msg," at line ", ex.lineno,":",ex.colno)   
   

def getMessage(token): 
    headers= { 'Authorization': token }   
    r = requests.get(server_url + '/api/message',headers=headers)   
    try:
        data = r.json()
        return data
    except json.JSONDecodeError as ex:
        print("Eror parsing json:",ex.msg," at line ", ex.lineno,":",ex.colno)

# Programa principal

if __name__ == "__main__":
    print("Python test frontend")
    token=getToken()
    print("The token is:", token)
    #print(getMessage(token))
 