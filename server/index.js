
///////////////////// IMPORTS //////////////////////

const http = require('http'),
      url = require('url'),
      { exec } = require('child_process'),
      camera = require('./camera');

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
  console.log("Received:", urlInfo.href);

  switch(urlInfo.pathname) {
    case '/on':
      handleRequest(camera.on(), response);
      break;
    case '/off':
      handleRequest(camera.off(), response);
      break;
    case '/say':
      let { words } = urlInfo.query;
      exec('say ' + words);
      serveResponse(response, 200, 'said ' + words);
      break;
    default:
      serveResponse(response, 404, 'endpoint does not exist');
      break;
  }
}

/////////////////////// MAIN ///////////////////////

http.createServer(server).listen(8005, () => {
  console.log("Server listening on port 8005");
});
