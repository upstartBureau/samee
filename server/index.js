
require('module-alias/register');

///////////////////// IMPORTS //////////////////////

const config = require('@config'),
      http = require('http'),
      url = require('url'),
      { exec } = require('child_process'),
      camera = require('./camera'),
      serveStaticFile = require('./static');

////////////////////// CONFIG //////////////////////

const SERVER_PORT = config.serverPort;

//////////////////// FUNCTIONS /////////////////////

function serveResponse(response, code, payload) {
  response.writeHead(code);
  response.end(payload);
}

function handleRequest(action, response) {
  action
    .then(data => serveResponse(response, 200, data))
    .catch(err => serveResponse(response, 500, err));
}

function server(request, response) {
  let urlInfo = url.parse(request.url, true);

  switch(urlInfo.pathname) {
    case '/start_camera':
      handleRequest(camera.on(), response);
      break;
    case '/stop_camera':
      handleRequest(camera.off(), response);
      break;
    case '/say':
      let { words } = urlInfo.query;
      exec('say ' + words);
      serveResponse(response, 200, 'said ' + words);
      break;
    case '/config':
      serveResponse(response, 200, JSON.stringify(config));
      break;
    default:
      serveStaticFile(urlInfo.pathname, response);
      break;
  }
}

/////////////////////// MAIN ///////////////////////

http.createServer(server).listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}.`);
});
