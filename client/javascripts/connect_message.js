
function ConnectMessage(messageDiv) {
  var timer; 
  
  return { 
    on: function() {
      var count = 0;
      timer = setInterval(function() {
        messageDiv.html("Connecting to Robot" + Array(count % 5 + 1).join("."));
        count++;
      }, 500);
    },

    off: function() {
      clearInterval(timer);
    },

    error: function(message) {
      clearInterval(timer);
      messageDiv.html(message);
    }
  };
}

// start the message like this:
//var message = new ConnectMessage($("#connecting-message"));

// on and off like this
// message.on();
// message.off();