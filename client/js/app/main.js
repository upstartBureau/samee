
(function() {

  // GLOBAL VARS
  var ip_address = CONFIG.sshHost;
  var stream_port = CONFIG.streamPort;

  var robot = new Robot();
  var gamepad = new Gamepad();
  var message = new ConnectMessage($("#connecting-message"));
  var stream_url = "http://" + ip_address + ":" + stream_port + "/?action=stream";

  // COMMANDS
  // message.on();
  /*  robot.connect(function(response) {
    if (response.status == "success") {
      console.log("Connected to robot.");
      message.off();
      initializeMain();     
    } else {
      console.log("Error: " + response.status);
      message.error("Could not connect.");
    }
  });*/

  //robot.connect();
  initializeMain();

  // INITIALIZATION
  function initializeMain() {
    console.log("running initialize main");
    $("#connecting-page").hide();
    $("#main").fadeIn(2000);

    // if the stream is on, load it into the robot camera
    $("<img>").load(function() {
      $("#robot-camera").attr('src', stream_url);
    }).attr('src', stream_url);

    initializeGamepad();
  }

  // CONTROL PANEL SWITCHES
  $("#control-panel-select").change(function(){
    $(".control-panel").hide();
    switch($(this).val()) {
      case "keyboard":
        $("#keyboard-control-panel").show();
        break;
      case "gamepad":
        $("#gamepad-control-panel").show();
        break;
      case "mouse":
        $("#chevron-control-panel").show();
        break;
      case "random":
        $("#random-control-panel").show();
        break;
      case "preferences":
        $("#preferences-control-panel").show()
        break;
    }

    console.log("changing panels");
    console.log($(this).val());
  });

  // $("#control-panel-select").trigger('change');

  // CONNECT BUTTON
  $("#connect-to-samee").click(function(){
    robot.connect();
  });

  // CAMERA CONTROLS
  $("#start-camera").click(function() {
    console.log("sending start request");
    $.get('/start_camera', function(response) {
      console.log(response);  
      setTimeout(function() {
        $("#robot-camera").attr('src', stream_url);
      }, 1000);
    });
  });

  $("#stop-camera").click(function() {
    console.log("sending stop request");
    $.get('/stop_camera', function(response) {
      console.log(response);
      $("#robot-camera").attr('src', '');
      $("#robot-camera").attr('src', '/img/bg.png');
    });
  });
  
  $("#take-snapshot").click(function() {
    console.log("snapshot request");
    $.get('/take_snapshot', function(response) {
      console.log(response);
      $("#robot-camera").hide();
      $("#robot-camera").fadeIn(100);
    });
  });

  $("#start-recording").click(function() {
    console.log("clicked start recording");
    $.get('/start_recording', function(response) {
      console.log(response);
      $(this).removeClass('fa-circle-thin');
      $(this).addClass('fa-circle recording');
    });
  });

  $("#stop-recording").click(function() {
    console.log("clicked stop recording");
    $.get('/stop_recording', function(response) {
      console.log(response);
      $('#start-recording').removeClass('fa-circle recording');
      $('#start-recording').addClass('fa-circle-thin');
    });
  });
  

  // RANDOM MOVEMENT
  $("#random-start").click(function() {
    console.log("starting random motion");
    shuffler.start();
  });

  $("#random-stop").click(function() {
    console.log("stopping random motion");
    shuffler.stop();
  });

  var shuffler = (function() {
    var cycle_time = 5000;
    var min_turn_time = 300;
    var max_turn_time = 1000;
    var straight_speed = 100;
    var turn_speed = 125;

    var timer;

    return {
      start: function() {

        timer = setInterval(function() {

          robot.update(straight_speed, straight_speed);

          var turn_time = Math.floor(Math.random() * (max_turn_time - min_turn_time)) + (cycle_time - max_turn_time);
          setTimeout(function() {
            var mult = Math.floor((Math.random() * 2)) == 0 ? 1 : -1;
            robot.update(mult * turn_speed, -1 * mult * turn_speed);
          }, turn_time);

        }, cycle_time);

      },

      stop: function() {
        clearInterval(timer);
      }
    }
  })();

  // CHEVRON CONTROLS
  var FBR = 1.0;     // front-back ratio
  var SSR = 1.0;     // spin-speed ratio

  /* var LMR = 0.9875;   // left motor reduction (forward)
  var RMR = 1.0;      // right motor reduction (back)

  var BLMR = 1.0;     // back left motor reduction
  var BRMR = 0.89;    // back right motor reduction*/

  var LMR = 1.0;
  var RMR = 1.0;
  var BLMR = 1.0;
  var BRMR = 1.0;

  $(".control").mousedown(function() {
    switch($(this)[0].id) {
      case "forward":
        robot.update(255 * FBR * LMR, 255 * FBR * RMR);
        break;
      case "left":
        robot.update(-255 * SSR, 255 * SSR);
        break; 
      case "right":
        robot.update(255 * SSR, -255 * SSR);
        break;
      case "back":
        robot.update(-255 * FBR * BLMR, -255 * FBR * BRMR);
        break;
    /*  case "slight-forward":
        robot.update(255 * FBR * LMR, 255 * FBR * RMR, 500);
        break;
        case "slight-left":
        robot.update(-255 * SSR, 255 * SSR, 500);
        break;
        case "slight-right":
        robot.update(255 * SSR, -255 * SSR, 500);
        break;
        case "slight-back":
        robot.update(-255 * FBR * BLMR, -255 * FBR * BRMR, 500);
        break;*/
    }
  });

  $(".control").mouseup(function(e) {
    e.stopPropagation();
    var id = $(this)[0].id;
    if (id == "forward" || id == "back" || id == "left" || id == "right") {
      robot.update(0, 0);
    }
  });

  // GAMEPAD CONTROLS
  function initializeGamepad() {
    for (var i = 0; i < 17; i++) {
      $('<div class="c-button">').html(i).appendTo($("#button-panel"));
    }

    gamepad.addAxisHandler(handleAxes);
    gamepad.addButtonHandler(handleButtons);
    gamepad.on();
  }

  function drawReticules(axes) {
    var multX = $(".axis-canvas.one").width() / 2.0;
    var multY = $(".axis-canvas.one").height() / 2.0;
    var x1 = multX * (axes[0] + 1);
    var y1 = multY * (axes[1] + 1);
    var x2 = multX * (axes[2] + 1);
    var y2 = multY * (axes[3] + 1);

    $(".reticule.one").css('top', (y1 - 5) + 'px').css('left', (x1 - 5) + 'px');
    $(".reticule.two").css('top', (y2 - 5) + 'px').css('left', (x2 - 5) + 'px');
  }

  function radius(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function handleAxes(axes) {
    // update the reticules
  //  drawReticules(axes);

    // get motor speeds based on the position of the axes
    var lmotor, rmotor, mult;
    if (Math.abs(axes[2]) > 0.1) {

      lmotor = axes[2] * SSR;
      rmotor = -1 * axes[2] * SSR;

    } else if (Math.abs(axes[0]) > 0.1 || Math.abs(axes[1]) > 0.1) {

   /* var left = -1 * axes[1];
      var left_mult = Math.min(1, 1 + 0.5 * axes[0]);

      var right = -1 * axes[1];
      var right_mult = Math.min(1, 1 - 0.5 * axes[0]);

      lmotor = left * left_mult;
      rmotor = right * right_mult;*/

      if (axes[0] <= 0) {
        lmotor = -1 * axes[1];

        mult = axes[1] < 0 ? 1 : -1;
        rmotor = mult * Math.min(1.0, radius(axes[0], axes[1]));
      } else {
        mult = axes[1] < 0 ? 1 : -1;
        lmotor = mult * Math.min(1.0, radius(axes[0], axes[1]));

        rmotor = -1 * axes[1];
      }

    } else {

      lmotor = 0;
      rmotor = 0;

    }

    // display the motor speeds
    $("#motor-display").html(
      "L motor: " + (lmotor * 255).toFixed(0) + '<br>' + 
      "R motor: " + (rmotor * 255).toFixed(0)
    );

    // send the speeds to the robot
    robot.update(lmotor * 255, rmotor * 255);

  }

  function handleButtons(buttons) {
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var pressed = button == 1.0;
      if (typeof(button) == "object") 
        pressed = button.pressed;

      if (pressed)  
        $(".c-button").eq(i).css('background-color', '#00c5ff'); 
      else
        $(".c-button").eq(i).css('background-color', 'transparent'); 
    }
  }


  // KEYBOARD CONTROLS
  var key_detector = (function () {
    var map = []; 

    onkeydown = onkeyup = function(e) {
      e = e || event; // to deal with IE
      map[e.keyCode] = (e.type == 'keydown');
      updateRobot();
   //   console.log("map = ", map);
    }

    // a = 65 d = 68
    // s = 83  w = 87
    // left arrow = 37
    // right arrow = 39

    function updateRobot() {
      var lmotor = 0, rmotor = 0;

      if (map[37]) {
        lmotor = -255;
        rmotor = 255;
      } else if (map[39]) {
        lmotor = 255;
        rmotor = -255;
      } else if (map[65] && map[87]) {
        lmotor = 150;
        rmotor = 255;
      } else if (map[68] && map[87]) {
        lmotor = 255;
        rmotor = 150;
      } else if (map[65]) {
        lmotor = 0;
        rmotor = 255;
      } else if (map[68]) {
        lmotor = 255;
        rmotor = 0;
      } else if (map[87]) {
        lmotor = 255;
        rmotor = 255;
      } else if (map[83]) {
        lmotor = -255;
        rmotor = -255;
      } 

     // display the motor speeds
      $("#motor-display").html(
        "L motor: " + lmotor + '<br>' + 
        "R motor: " + rmotor
      );
         
      robot.update(lmotor, rmotor);
    }

  })();

})();

