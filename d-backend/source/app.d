//import std.stdio;
import std.conv;

import vibe.http.router;
import vibe.web.rest;
import vibe.inet.url;
import vibe.core.core;
//import vibe.core.args;
import vibe.core.log;
import vibe.web.web;
import vibe.http.session;

import restapi;
import webapi;

import configuration;

void main()
{
	read_configuration();
	auto router = new URLRouter;
    auto rest_settings = new RestInterfaceSettings();
	logInfo("D backend running.");
	logInfo("This backend has both a Rest API and a Web Interface.");

    string my_url = "http://" ~ my_configuration.server_address ~ ":" ~ to!string(my_configuration.server_port);
	rest_settings.baseURL= URL(my_url ~ "/api");


	// CORS
	// tomado de https://github.com/wilzbach/vibe-d-by-example/blob/master/cors.d
	// Esta política permite a cualquier sitio web usar la API
	// podría cambiarse por una más restrictiva, especificando qué dominio puede accder a la API
	// Hay que hacerlo ANTES de registrar la API ¡sino no funciona!

	router.any("/api/*", delegate void(scope HTTPServerRequest req, scope HTTPServerResponse res) {
		logInfo("Adding Access-Control-Allow-Origin header");
		res.headers["Access-Control-Allow-Origin"] = "*";
	});
 
	API my_api = new API();
	router.registerRestInterface(my_api,rest_settings);

    auto web_interface = new Web_Interface();
	web_interface.api = my_api;

	router.registerWebInterface(web_interface);
    auto settings = new HTTPServerSettings;
	settings.port =  my_configuration.server_port;
	settings.bindAddresses = [my_configuration.server_address];

	settings.sessionStore = new MemorySessionStore;

    // generates a JS file for using the API 
	router.get("/api.js", serveRestJSClient!API_Interface(rest_settings));


	listenHTTP(settings, router);
	
	runEventLoop();
	// Originalmente usábamos esta versión que procesa lineas de comandos y genera
	// conflictos con el programa principal
	 //runApplication();

}