
## Installation

### Wifi hookup

1. Connect the Yun to power. Some lights will start blinking and it will boot up.

2. Switch your machine to the arduino-xxxx wifi network when it shows up in the list.

3. Go to http://arduino.local and login with password 'arduino'.

4. Configure the Yun with your wifi network/password, and click restart.

5. Switch your machine back to the original wifi network.

### Linino installs

Log in to the linux side of the Yun using ssh: `ssh root@arduino.local` with password 'arduino'. Then install the following:

1. yunSpaceBrew -- for websockets communications. Installation instructions are here: https://github.com/julioterra/yunSpacebrew. See section called Installing Linino Python and Shell Scripts

2. mjpg-streamer -- for video streaming

3. ffmpeg -- for taking snapshots, creating videos. Currently these features are disabled so you don't technically need this.

### Computer installs

1. Install the Arduino IDE. Version 1.5.8 will definitely work. Later versions may have compatibility issues regarding the C libraries.

2. Install node/npm

3. Clone this repo and cd into it

4. run `npm install` to install local third-party dependencies

5. If you want to do development, globally install nodemon and browser-sync:

```
npm install -g nodemon          // to develop the server
npm install -g browser-sync     // to develop the web client
```

### Arduino installs

1. Open the yunServer.ino script in the Arduino IDE. 

2. Find the Yun in the Tools/Ports menu and connect to it.

3. Upload the script to the Yun.

## Run the app

Run `npm run deploy-local` from the root of the repo. This will start the node server and open your browser to the running app. 

While the app is running you can check the spacebrew admin panel to see the websocket connection between samee and the web-client. http://spacebrew.github.io/spacebrew/admin/admin.html?server=sandbox.spacebrew.cc. If there's no visual link between them, something is wrong :(

## Development

1. `npm run dev-server`: starts a nodemon server, watching the `server` folder.

2. `npm run dev-client`: starts browsersync, watching the `client` folder. Note: to develop the client, you need to run the server. So you should run `npm run dev-server` in a separate terminal window.

3. `npm run convert-config`: translates the `config.js` file into Arduino C (so the Yun can consume it), and vanilla javascript (so the web client can consume it). Puts the two files in the right places in the `client` and `arduino` directories. You should run this command any time you update the config.

