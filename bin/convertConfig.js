
require('module-alias/register');

//////////////////// IMPORTS ///////////////////////

const config = require('@config'),
      fs = require('fs');

//////////////////// CONFIG ////////////////////////

const C_FILE  = __dirname + '/../arduino/yunServer/config.h',
      JS_FILE = __dirname + '/../client/javascripts/config.js';

/////////////////// FUNCTIONS //////////////////////

function saveFile(filepath, content) {
  fs.writeFile(filepath, content, err => {
    if (err)
      console.log("ERROR:", err);
    else
      console.log("wrote:", filepath);
  });
}

function writeCFile() {
  let headerFile = Object.keys(config).map(key => {
    let val = config[key];
    if (typeof val === 'number')
      return `const int ${key} = ${val};`;
    else
      return `const String ${key} = "${val}";`;
  }).join('\n');

  saveFile(C_FILE, headerFile);
}

function writeJSFile() {
  let jsFile = `var CONFIG = ${JSON.stringify(config)};`;
  saveFile(JS_FILE, jsFile); 
}

///////////////////// MAIN /////////////////////////

writeCFile();
writeJSFile();






