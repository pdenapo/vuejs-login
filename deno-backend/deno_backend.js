
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts"


const json_config= await Deno.readTextFile('../config.json')
console.log("json_config=",json_config)
const config= JSON.parse(json_config)
const server_url=`http://${config['server_address']}:${config['server_port']}` 

const server_secret_key="my secret key" // Change this!

const router = new Router();

router.get("/", (context) => {
        context.response.body = "Deno backend running at "+server_url;
          });


const app = new Application();


router.post('/api/sign_in', (ctx) =>
 {
    console.log("Method sign_in called.")
    console.log("headers=",ctx.request.headers)
    const  username = ctx.request.headers.get('username')
    const  password = ctx.request.headers.get('password')
    console.log("username=", username)
    console.log("password=", password)

    if (typeof username === 'undefined')
    {
        ctx.response.status = 400
        ctx.response.body = {"statusMessage": "Missing username parameter"}
    }
    else if (typeof password === 'undefined')
    {
        ctx.response.status = 400
        ctx.response.body = {"statusMessage": "Missing passord parameter"}
    }

    else {
        const access_token = await create({ alg: "HS512", typ: "JWT" }, { "sub": username }, server_secret_key)
        ctx.response.status = 200 
        ctx.response.body = 
         {
        "statusMessage": "Sucesfully Logged in",
        "Authorization": "Bearer "+ access_token
         }
    }

    ctx.response.headers.set("Content-Type", "application/json")
})

app.use(router.routes());
app.use(router.allowedMethods());


console.log("HTTP webserver running.  Access it at:" +server_url); 
await app.listen({ hostname:config['server_address'],  port: config['server_port'] });      
