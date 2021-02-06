
const json_config= await Deno.readTextFile('../config.json')
console.log("json_config=",json_config)
const config= JSON.parse(json_config)
const server_url=`http://${config['server_address']}:${config['server_port']}` 


import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.get("/", (context) => {
        context.response.body = "Deno backend running at "+server_url;
          });


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("HTTP webserver running.  Access it at:" +server_url); 
await app.listen({ hostname:config['server_address'],  port: config['server_port'] });      
