
module webapi;

const use_authorization= true;
// se puede poner como false para debugear
// const use_authorization= false;

import std.conv;
import std.file;
import std.stdio;
import std.path;

import vibe.web.auth;
import vibe.web.web;
import vibe.http.server;
import vibe.core.log:logInfo;
import vibe.data.json;

import configuration;
import restapi;
import vibe.core.file;


static struct WebAuthInfo {
	string userName;
 }

@requiresAuth
static class Web_Interface 
{
    private {
		// stored in the session store
	SessionVar!(bool, "authenticated") user_authenticated;
	SessionVar!(string, "user_name") user_name;
	SessionVar!(string, "user_password") user_password;
	}
	
	API api;
	

	@noRoute WebAuthInfo authenticate(scope HTTPServerRequest req, scope HTTPServerResponse res)
	{
	  static if (use_authorization)
	  {
	  if (!user_authenticated) 
		throw new HTTPStatusException(HTTPStatus.unauthorized);
	  else 
		return WebAuthInfo(user_name);
	  }
	  else  
	  	return WebAuthInfo("anónimo");
	}
	
   // GET /
   @noAuth void index()
	{
	string name=my_configuration.program_name;	
	if (user_authenticated)
	{
		render!("api.dt",name);
	}
	else 
		render!("index.dt",name);
  }

  @noAuth @path("/mensaje") string getMensaje()
  {
	return my_configuration.program_name ~ " escuchando.";
  }

    @noAuth @path("/mensaje2") void getMensaje2()
  {
	  // Si uno quiere enviar html al browser hay que hacerlo así!
	  // (especificando el tipo mime!)
	  response.writeBody("<html><body> " ~ my_configuration.program_name ~ " escuchando.</body></html>","text/html");
  }
   
    @headerParam("username", "username") @headerParam("password", "password")
    @noAuth @path("/login") 
    void postLogin(string username, string password)
	{
	logInfo("Comenzamos el método login username=" ~ username ~ ",password=" ~ password);
	bool chequeo_de_credenciales = username == my_configuration.user  && 
											   password == my_configuration.password;
	logInfo("chequeo_de_crenciales=" ~ to!string(chequeo_de_credenciales));
	if (!chequeo_de_credenciales)
		throw new HTTPStatusException(HTTPStatus.unauthorized,"Invalid user name or password.");
	user_authenticated = true;
	user_name = username;
	user_password =  password;
	
	redirect("/");
   }
   
    @anyAuth @path("/logout") 
	void getLogout()
	{
		user_authenticated = false;
		terminateSession();
		redirect("/");
	}
  
}

