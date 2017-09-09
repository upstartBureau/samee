
function Robot() {

  // PRIVATE VARIABLES
  var new_direction = [0, 0];
  var last_direction = [0, 0];
  var running = false;

  var sb = {};
  var string_subs = [];

  var ws_server = CONFIG.spacebrewHost;               // ip of the websockets server

  // command feed configuration
  var client_name = CONFIG.sbSameeName;               // name of the remote listener

  //var remote_address = "machinemensch.dynu.com";    // remote listener's ip (same as this IP if running samee locally)
  var remote_address = "162.211.146.102";

  var pub_name = CONFIG.sbMotorSendFeed;              // name of the publication feed
  var sub_name = CONFIG.sbMotorReceiveFeed;           // name of the remote listener's subscription feed

  // INITIALIZATION COMMANDS
  setupSpacebrew();

  // PRIVATE FUNCTIONS
  function setupSpacebrew (){

    // setup spacebrew
    console.log("setting up spacebrew");
    sb = new Spacebrew.Client(ws_server);
    sb.extend(Spacebrew.Admin);
    sb.debug = false;

    // set the base description
    sb.name("samee-user");
    sb.description("Sends a message to samee.");

    // create the spacebrew subscription channels
    sb.addPublish(pub_name, "string", "");          // create the publication feed
    //sb.addSubscribe("light-receive", "string");     // create the subscription feed

    // configure the publication and subscription feeds
    sb.onStringMessage = onStringMessage;   
    sb.onNewClient = onNewClient;
    sb.onUpdateClient = onNewClient;
    sb.onRemoveClient = onRemoveClient;
    sb.onUpdateRoute = onUpdateRoute;

    // connect to spacebrew
    sb.connect(); 

    console.log("sb = ", sb);
  }

  function connectToSamee() {
    console.log("NEW route " + pub_name + " client " + client_name + 
                " add " + remote_address + " sub " + sub_name);
    sb.addSubRoute(pub_name, client_name, remote_address, sub_name);
  }

  function onStringMessage( name, value ){
    console.log("[onStringMessage] string message received ", value);
    $("#light-meter").text("Light: " + value);        
  }

  function onNewClient( client ) {
    console.log("[onNewClient] new client ", client);
  }

  function onRemoveClient( name, address ) {
    console.log("[onRemoveClient] remove client '" + name + "' with address '" + address + "'");
  }

  function onUpdateRoute ( type, pub, sub ) {
    console.log("route updated");
    console.log("type = " + type);
    console.log("pub = ", pub);
    console.log("sub = ", sub);
  }

  function copyDirection(dir) {
    return [dir[0], dir[1]];
  }

  function directionChange(dir1, dir2) {
    // note that direction is considered changed if one of the directions is a timed movement
    return dir1[0] != dir2[0] || dir1[1] != dir2[1];
  }

  function pad_str(num, size) {    
    var s = "000000" + num;
    return s.substr(s.length - size);
  }

  function commandString(direction) {
    var s = (direction[0] >= 0) ? "1" : "0";
    s += pad_str(Math.abs(direction[0]), 3);
    s += (direction[1] >= 0) ? "1" : "0";
    s += pad_str(Math.abs(direction[1]), 3);   
    return s;
  }

  function start() {
    running = true; 
    
    (function request() {
      if (running && directionChange(new_direction, last_direction)) {

        last_direction = copyDirection(new_direction);
        console.log("command = " + commandString(last_direction));

        sb.send(pub_name, "string", commandString(last_direction));
        request();

      } else
        running = false;
    })();  
  }

  // PUBLIC FUNCTIONS
  return {
    connect: function(callback) {
      connectToSamee();
    },

    update: function(left, right) {
      new_direction = [Math.round(left), Math.round(right)];

      if (!running) {
        start(); 
      }
    },

    stop: function() {
      running = false;
    }
  };
}