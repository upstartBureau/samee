////////////////// IMPORTS ///////////////////

const config = require('@config'),
      fs = require('fs');

////////////////// CONFIG ////////////////////

const CLIENT_DIR = config.clientDir;

////////////////// PRIVATE ///////////////////

function getContentType(pathname) {
  let extension = pathname.match(/\.[^.]*$/)[0];
  switch(extension) {
    case '.css':  return 'text/css';
    case '.js':   return 'text/javascript';
    case '.json': return 'application/json';
    default:      return 'text/html';
  }
}

function serveStaticFile(relPath, response) {

  // get the full file path
  if (relPath == '/')
    relPath = '/index.html';

  let absPath = CLIENT_DIR + relPath,
      stat;

  // return 404 if the file doesn't exist
  try {
    stat = fs.statSync(absPath);
  } catch(e) {
    console.log("File not found: " + absPath);
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end();
    return;
  }

  // otherwise serve the file
  console.log("Serving: " + relPath);
  response.writeHead(200, {
    'Content-Type': getContentType(relPath),
    'Content-Length': stat.size
  });
  fs.createReadStream(absPath).pipe(response);
}

////////////////// EXPORTS ///////////////////

module.exports = serveStaticFile;

