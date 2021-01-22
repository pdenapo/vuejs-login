module configuration;
import std.file;
import vibe.data.json;

struct Configuration{
  string user="user";
  string  password="secret";
  string server_secret_key="secret";
  string program_name = "Viejs.Login d-backend";
  //string server_address= "127.0.0.1";
  string server_address= "192.168.1.103";
  ushort server_port=9000;
}

// server_address amd server_port have a default value but can be modified via a config file in json.

Configuration my_configuration;

void read_configuration()
{
   string config_file= readText("../config.json");
   Json config_json= parseJson(config_file);
   my_configuration.server_address = config_json["server_address"].get!string;
   my_configuration.server_port = config_json["server_port"].get!ushort;
}
