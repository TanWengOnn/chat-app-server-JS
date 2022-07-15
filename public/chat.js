//Create  connection
var socket = io.connect("http://localhost:5000"); // io.connect("http://192.168.100.195:5000");

//Query DOM
var message = $("#message");
var username = $("#username");
var btn = $("#send");
var output = $("#output");
var feedback = $("#feedback");

var typing;

socket.emit("history", {}, function (response) {
  response.forEach((el) => {
    output.append(
      "<p><strong>" + el.username + ":</strong>" + el.text + "</p>"
    );
  });
});

//-----------------------Send Message---------------------//
//Emit event
btn.on("click", function () {
  socket.emit("chat", {
    username: username.val(),
    message: message.val(),
  });
});

message.keypress(function () {
  socket.emit("typing", username.val());
  document.getElementById("message").addEventListener("keypress", (e) => {
    typing = true;
    console.log("keydown: " + typing);
  });

  document.getElementById("message").addEventListener("keyup", () => {
    typing = false;
    console.log("keyup: " + typing);
  });
});

//Listen event
socket.on("chat", function (data) {
  output.append(
    "<p><strong>" + data.username + ":</strong>" + data.message + "</p>"
  );
  //feedback.html("");
  document.getElementById("chat-window").scrollTop = output[0].scrollHeight;
});

socket.on("typing", function (data) {
  if (typing === true) {
    // *** Problem: the "typing" variable is not getting the value from line 33 and 38 *** //

    // this is for testing
    document.getElementById("typing").setAttribute("hidden", "");

    // This is the correct code
    // document.getElementById("typing").removeAttribute("hidden");
    console.log("keydown");
    // view the console from the other clients
    console.log(typing); // Should not be undefined as value are given under line 33 and 38
  } else {
    // This is the correct code
    // document.getElementById("typing").setAttribute("hidden", "");

    // This is to test the "removeAttribute" function (it works)
    // this should be under "true"
    document.getElementById("typing").removeAttribute("hidden");
    document.getElementById("typing").innerHTML = data + " is typing...";
    console.log("keyup");
    // view the console from the other clients
    console.log(typing); // Should not be undefined as value are given under line 33 and 38
  }
});
