
module.exports = {

  // directory structure
  serverDir:  __dirname + '/server',
  clientDir:  __dirname + '/client',
  arduinoDir: __dirname + '/arduino',

  // where the node server runs
  serverPort: 8005,
  
  // how the node server contacts the camera
  sshHost: 'arduino.local',
  sshUser: 'root',
  sshPass: 'arduino',
  sshPort: 22,

  // where the camera streams
  streamPort: 8080,

  // websocket configuration
  spacebrewHost:      'sandbox.spacebrew.cc',
  sbSameeName:        'samee',
  sbWebClientName:    'samee-user',
  sbMotorSendFeed:    'command',
  sbMotorReceiveFeed: 'command-receive'
  
};