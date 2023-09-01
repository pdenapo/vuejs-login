
import { assertEquals } from "https://deno.land/std@0.200.0/assert/mod.ts";

const server_url= "http://127.0.0.1:9000"

//let resp = await fetch(server_url);
// console.log(resp.status); 
// console.log(resp.headers.get("Content-Type")); 
// console.log(await resp.text()); 

//let token= await getToken();
//console.log(token)

async function getMessage(authorization)
{
  console.log("Method test_getMessage called")
  const headers= { 'Authorization': authorization }   
  const r = await fetch(server_url + '/api/message',{headers:headers})
  const data = await r.json()
  console.log ("data recieved=",data)
  return {status: r.status, message: data}
}

async function getToken()
{
  console.log ("Method test_getToken called")
  const headers = { 
    'username': 'user',
    'password': 'secret'
  }
  let response= await fetch(server_url+ '/api/sign_in',{ method: "post", headers:headers})
    let data = await response.json()
   
  let authorization=data['Authorization']
  return {status: response.status, authorization: authorization}
}


Deno.test("get_message", async ()=>{
    let token= await getToken()
    console.log("token=",token)
    //console.log("status=",token.status)
    assertEquals(token.status, 200);
    assertEquals(token.authorization.split(' ')[0],"Bearer")                  
    const {status, message}= await getMessage(token.authorization)
    assertEquals(status, 200);
    assertEquals(message["logged_in_as"],"user")
 })

