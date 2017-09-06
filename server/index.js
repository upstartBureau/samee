
///////////////////// IMPORTS //////////////////////

const http = require('http'),
      url = require('url'),
      { exec } = require('child_process');

//////////////////// FUNCTIONS /////////////////////

function server(request, response) {
  let urlInfo = url.parse(request.url, true);
  switch(urlInfo.pathname) {
    case '/say':
      console.log("received say command");
      console.log(urlInfo.query);
      exec('say ' + urlInfo.query.statement);
      response.writeHead(200);
      response.end('hello');
      break;
  }
}

/////////////////////// MAIN ///////////////////////

http.createServer(server).listen(8005, () => {
  console.log("Server listening on port 8005");
});