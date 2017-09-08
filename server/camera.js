
/////////////////// IMPORTS //////////////////////

const config = require('@config'),
      SSH = require('simple-ssh'),
      Promise = require('bluebird');

/////////////////// CONFIG ///////////////////////

const SSH_HOST    = config.sshHost,
      SSH_USER    = config.sshUser,
      SSH_PASS    = config.sshPass,
      SSH_PORT    = config.sshPort,
      STREAM_PORT = config.streamPort;

//////////////// INITIALIZATION //////////////////

const ssh = new SSH({
  host: SSH_HOST,
  user: SSH_USER,
  pass: SSH_PASS,
  port: SSH_PORT
});

ssh.on('error', err => console.log("SSH ERROR:", err));

////////////// PRIVATE FUNCTIONS /////////////////

function execSSH(cmd) {
  return new Promise((resolve, reject) => {
    ssh.exec(cmd, {
      exit: (code, stdout, stderr) => {
        ssh.reset(() => resolve({code, stdout, stderr}))
      }
    }).start();
  });
}

function cameraOn() {
  console.log("starting camera");

  let cmd = `mjpg_streamer -i 'input_uvc.so -d /dev/video0 -r 360x600 -f 25' ` +
            `-o 'output_http.so -p ${STREAM_PORT} -w /www/webcam' &`;

  return execSSH(cmd)
    .then(({code, stdout, stderr}) => {
      if (code === 0)
        return Promise.resolve('camera on');
      else
        return Promise.reject(stderr);
    });
}

function cameraOff() {
  console.log("stopping camera");

  let cmd = 'killall webcamDaemon mjpg_streamer';

  return execSSH(cmd)
    .then(({code, stdout, stderr}) => {
      if (code === 1)
        return Promise.resolve('camera off');
      else
        return Promise.reject(stderr);
    });
}

//////////////////// EXPORTS //////////////////////

module.exports = {
  on:  cameraOn,
  off: cameraOff
};
