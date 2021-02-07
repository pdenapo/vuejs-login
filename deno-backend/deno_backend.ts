import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";

// Reads the configuration shared between the server and the client

const json_config = await Deno.readTextFile("../config.json");
console.log("json_config=", json_config);
const config = JSON.parse(json_config);

const server_url = `http://${config["server_address"]}:${
  config["server_port"]
}`;

// Reads the configuration only known to the server

const json_server_config = await Deno.readTextFile("../server_config.json");
console.log("json_server_config=", json_server_config);
const server_config = JSON.parse(json_server_config);

const server_secret_key = "my secret key"; // Change this!

// Duración de un jwt antes de expirar en milisegundos
const expiration_duration = 60 * 60 * 24; // un dia

const router = new Router();

router.get("/", (context) => {
  context.response.body = "Deno backend running at " + server_url;
});

const app = new Application();

async function sign_in(ctx: Context ) {
  console.log("Method sign_in called.");
  console.log("headers=", ctx.request.headers);
  
  // chequeamos por null para evitar un error de typescript

  const user_name = ctx.request.headers.get("username") || '{}';
  const password = ctx.request.headers.get("password");
  console.log("Received data");
  console.log("username=", user_name);
  console.log("password=", password);

  if (user_name === undefined) {
    console.log("Usuario indefinido")
    ctx.response.status = 400;
    ctx.response.body = { "statusMessage": "Missing username parameter" };
  } else if (password === undefined) {
    console.log("Password indefinido")
    ctx.response.status = 400;
    ctx.response.body = { "statusMessage": "Missing passord parameter" };
  } else {
    console.log("Looking for user...");
    console.log(server_config.users);

    interface User {
      id: string;
      password: string;
    }

    const user = server_config.users.find((u:User) => u.id == user_name);

    if (user !== undefined) {
      console.log("User recognized. ");
    } else {
      console.log("User not recognized.");
    }

    if ((user !== undefined) && (user.password == password)) {
      console.log("User recognized. Creating token...");

      const current_time = Date.now();
      console.log("current_time=", current_time);
      console.log("expiration_duration=", expiration_duration);
      const expiration_time = current_time + expiration_duration;
      console.log("expiration_time=", expiration_time);
      var payload =  {
        "iat": current_time,
        "exp": expiration_time,
        "sub": user_name,
      };
      console.log("payload" + JSON.stringify(payload));

      const access_token = await create(
        { alg: "HS512", typ: "JWT" },
        payload,
        server_secret_key,
      );
      ctx.response.status = 200;
      ctx.response.body = {
        "statusMessage": "Sucesfully Logged in",
        "backend": "Deno backend",
        "Authorization": "Bearer " + access_token,
      };
    } else {
      console.log("User not recognized.");
      ctx.response.status = 401;
      ctx.response.body = {
        "statusMessage": "Invalid user/password combination.",
        "backend": "Deno backend",
      };
    }

    console.log("sending status=", ctx.response.status);
    console.log("sending body=", ctx.response.body);

    //ctx.response.headers.set("Content-Type", "application/json")
  }
}

router.post("/api/sign_in", sign_in);

app.use(router.routes());
app.use(router.allowedMethods());

console.log("HTTP webserver running.  Access it at:" + server_url);
await app.listen({
  hostname: config["server_address"],
  port: config["server_port"],
});
