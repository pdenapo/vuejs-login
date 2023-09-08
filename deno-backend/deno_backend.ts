import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v2.2/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

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
const jwt_algorithm = "HS512";

const server_secret_key = server_config["server_secret_key"];

// Duración de un jwt antes de expirar en milisegundos
const jwt_duration = server_config["jwt_duration"];

const router = new Router();

router.get("/", (context) => {
  context.response.body = "Deno backend running at " + server_url;
});


async function sign_in(ctx: Context) {
  console.log("Method sign_in called.");
  console.log("headers=", ctx.request.headers);

  // chequeamos por null para evitar un error de typescript

  const user_name = ctx.request.headers.get("username") || "{}";
  const password = ctx.request.headers.get("password");
  console.log("Received data");
  console.log("username=", user_name);
  console.log("password=", password);

  if (user_name === undefined) {
    console.log("Usuario indefinido");
    ctx.response.status = 400;
    ctx.response.body = { "statusMessage": "Missing username parameter" };
  } else if (password === undefined) {
    console.log("Password indefinido");
    ctx.response.status = 400;
    ctx.response.body = { "statusMessage": "Missing passord parameter" };
  } else {
    console.log("Looking for user...");
    console.log(server_config.users);

    interface User {
      id: string;
      password: string;
    }

    const user = server_config.users.find((u: User) => u.id == user_name);

    if (user !== undefined) {
      console.log("User recognized. ");
    } else {
      console.log("User not recognized.");
    }

    if ((user !== undefined) && (user.password == password)) {
      console.log("User recognized. Creating token...");

      const current_time = Date.now();
      console.log("current_time=", current_time);
      console.log("jwt_duration=", jwt_duration);
      const expiration_time = current_time + jwt_duration;
      console.log("expiration_time=", expiration_time);
      let payload = {
        "iat": current_time,
        "exp": expiration_time,
        "sub": user_name,
      };
      console.log("payload" + JSON.stringify(payload));

      const access_token = await create(
        { alg: jwt_algorithm, typ: "JWT" },
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

// Middleware to check jwt

let user: string | undefined;

const validateToken = async (ctx: Context, next: any) => {
  console.log("method validateToken called.");
  const authorization: string | null = ctx.request.headers.get("Authorization");
  // We remove Bearer
  console.log("authorization=", authorization);
  if (authorization != null) {
    try {
      const jwtToken = authorization.split(" ")[1];
      const payload = await verify(jwtToken, server_secret_key, jwt_algorithm);
      user = payload["sub"];
      console.log("user=", user);
      await next();
    } catch {
      ctx.response.body = { statusMessage: "Unauthorized" };
      ctx.response.status = 401;
      return;
    }
  } else {
    ctx.response.body = { statusMessage: "Missing authorization header." };
    ctx.response.status = 401;
  }
  console.log("sending status=", ctx.response.status);
  console.log("sending body=", ctx.response.body);
};

router.get("/api/message", validateToken, (ctx) => {
  console.log("getMessage method called");
  ctx.response.status = 200;
  ctx.response.body = { statusMessage: "Ok", logged_in_as: user };
  console.log("sending status=", ctx.response.status);
  console.log("sending body=", ctx.response.body);
});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

console.log("HTTP webserver running.  Access it at:" + server_url);
await app.listen({
  hostname: config["server_address"],
  port: config["server_port"],
});
