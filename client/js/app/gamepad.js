
function Gamepad() {
  var pad, buttonHandler, axisHandler;
  var rAF = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame;

  function connecthandler(e) {
    pad = e.gamepad;
    rAF(updateStatus);
  }

  function disconnecthandler(e) {
    delete pad;
  }

  function scangamepads() {
    pad = navigator.getGamepads ? 
            navigator.getGamepads()[0] : 
            (navigator.webkitGetGamepads ? 
              navigator.webkitGetGamepads()[0] : 
              []);
  }

  function updateStatus() {
    scangamepads();
    if (pad) {
      buttonHandler(pad.buttons);
      axisHandler(pad.axes);
      rAF(updateStatus);
    }
  }

  return {
    on: function() {
      if ('GamepadEvent' in window) {
        window.addEventListener("gamepadconnected", connecthandler);
        window.addEventListener("gamepaddisconnected", disconnecthandler);
      } else {
        setInterval(scangamepads, 500);  // this never runs in chrome?
      }
    },

    addButtonHandler: function(handler) {
      buttonHandler = handler;
    },

    addAxisHandler: function(handler) {
      axisHandler = handler;
    }
  };
}