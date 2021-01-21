module restapi;

import std.algorithm.searching;
import std.datetime.date;
import std.datetime.systime;
import core.time;
// import std.stdio;
import std.file;
import std.json;
import std.conv;
import std.range;

import vibe.db.mongo.mongo;
import vibe.db.mongo.client;
import vibe.web.rest;
import vibe.web.auth;
import vibe.http.server;
import vibe.core.log:logInfo;
import vibe.data.serialization;
import vibe.data.json;

// Para generar números aleatorios criptográficamente seguros
import csprng.system;

import jwtd.jwt;

import configuration;

const static bool use_jwt= true;	

const Duration token_duration = 1.days;


struct User
{
 string id;
}

struct SigInMessage 
{
 string statusMessage;
 string AuthToken;
}


static struct AuthInfo {
@safe:
	string userName;

//  You can use this to define different user roles
//	bool isAdmin() { return this.userName == "tom"; }
}

@requiresAuth
interface API_Interface
{
	 @anyAuth string getMessage();
	 @anyAuth string getHello(string nombre);

	//string postLogin(string username, string password);
	@noRoute AuthInfo authenticate(scope HTTPServerRequest req, scope HTTPServerResponse res);
	
	 static if (use_jwt)
	{
	     @headerParam("username", "username") @headerParam("password", "password") @noAuth SigInMessage postSignIn(string username, string password);
	}
}	

// TODO: Los métodos get den ser declarados @safe
//  @safe function app.API.getSaldos cannot call @system 
// function exit

class API : API_Interface
{
	// This is useful so that all methods can access the authorization info
	private AuthInfo auth_info;
	
	//MongoClient cliente_mongo;
	private CSPRNG generador_de_números_aleatorios;  

	string[ulong] peticiones;
	
	@noRoute override AuthInfo authenticate(scope HTTPServerRequest req, scope HTTPServerResponse res)
	{
		logInfo("AuthInfo method called");
		static if (use_jwt)
		{
			
		JSONValue payload_json;
		logInfo("Decoding jwt token");
		
		if(!("AuthToken" in req.headers))
			throw new HTTPStatusException(HTTPStatus.unauthorized,"No Token");
		
		try
		{
		 payload_json = decode(req.headers["AuthToken"],my_configuration.server_secret_key);
		}
		catch (VerifyException)
		{
		  throw new HTTPStatusException(HTTPStatus.unauthorized,"Invalid Token");	
		}
			
		logInfo("payload=" ~ to!string(payload_json));		
				
		 /* We check that the token has not expired */	 
		 long currentTime_unix = Clock.currTime().toUnixTime();
		 logInfo("currentTime_unix =" ~ to!string(currentTime_unix));
		
		 if ("exp" in payload_json)
		 {
		 	
		 	long expiration_time = payload_json["exp"].integer; 
		 	logInfo("expiration_time =" ~ to!string(expiration_time));
		 	if (expiration_time<currentTime_unix)
		 	{
		 	 logInfo("Expired token");
		 	 throw new HTTPStatusException(HTTPStatus.unauthorized,"Expired token");
		 	}
		 }
		 	 this.auth_info = AuthInfo(payload_json["sub"].str);
			}  /* end if use_jwt */
	   static if (!use_jwt)
	   { 
		 this.auth_info = AuthInfo("user");
		}
		 return this.auth_info;
	}

	@anyAuth @safe override string getMessage()
	{
		return my_configuration.program_name ~ " listeting to requests on port " ~ to!string(my_configuration.server_port);
	}
	
	// llamar con http://127.0.0.1:8081/hello?nombre=Pablo
	@anyAuth @safe override string getHello(string name)
	{
		return "Hello " ~ name ~ " !";
	}

	static if (use_jwt)
	{
		
	// Method for user Sing In
	
	@noAuth override SigInMessage postSignIn(string username, string password)
	{  
	   logInfo("postSignIn method called");
	   
	   /* We check if the user has the right credetials. 
	   /* Todo: implement SignUp and store the users in a database */
	   
	   bool chequeo_de_credenciales = username == my_configuration.user && 
											   password == my_configuration.password;
		   
	   if (chequeo_de_credenciales) 
	   {
	    auto user = User(username);
	    string token = createToken(user,token_duration);
	    return SigInMessage("Sucesfully Logged in", token);
	   }
	  else 
	   throw new HTTPStatusException(HTTPStatus.unauthorized,"Invalid user/password combination");
	}
 }

 static if (use_jwt)
{
 @noRoute private string createToken(User who,  Duration expiration_duration)
 {
  JSONValue[string] payload;
  payload["sub"] = JSONValue(who.id);
  SysTime currentTime = Clock.currTime();
  payload ["iat"] =  JSONValue(currentTime.toUnixTime());
  DateTime current_date = to!DateTime(currentTime);
  if (expiration_duration)
  {
    DateTime expieraton_date =current_date + expiration_duration ;
    payload["exp"] = JSONValue(to!SysTime(expieraton_date).toUnixTime());
  }
  JSONValue payload_json= JSONValue(payload);
  logInfo("created token" ~ to!string(payload_json));
  string server_secret_key = my_configuration.server_secret_key;
  string token= encode(payload_json,server_secret_key,JWTAlgorithm.HS256);
  return token;   	
 }
}


} /* Fin de class API  */


