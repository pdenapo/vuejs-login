#!/usr/bin/env python3

import unittest

import json
with open('../config.json') as f:
    config = json.load(f)

server_url= "http://"+config['server_address']+":"+ str(config['server_port']) 

import requests
# Ayuda en https://requests.readthedocs.io/es/latest/

class TestSuite(unittest.TestCase):
    
    def test_getMessage(self):
        status_code, authorization = self.getToken()
        self.assertEqual(status_code,200)   
        self.assertEqual(authorization.split(sep=' ')[0],"Bearer")                  
        status_code, message= self.getMessage(authorization)
        self.assertEqual(status_code,200)   
        self.assertEqual(message["logged_in_as"],"user") 


    def getToken(self):
        print("\n *Method test_getToken called")
        headers = { 
            'username': 'user',
            'password': 'secret'
        }
        r = requests.post(server_url + '/api/sign_in',headers=headers)
        try:
            data = r.json()
            print("data recieved=",data)
            authorization=data['Authorization']
            return r.status_code,authorization
        except json.JSONDecodeError as ex:
            print("Eror parsing json:",ex.msg," at line ", ex.lineno,":",ex.colno)
        
    def getMessage(self,authorization):
        print("\n * Method test_getMessage called") 
        headers= { 'Authorization': authorization }   
        r = requests.get(server_url + '/api/message',headers=headers)
        try:
            data = r.json()
            print("data recieved=",data)
            return r.status_code,data
        except json.JSONDecodeError as ex:
            print("Eror parsing json:",ex.msg," at line ", ex.lineno,":",ex.colno)
        

# Programa principal

if __name__ == "__main__":
    print("Python test frontend")
    unittest.main()
    