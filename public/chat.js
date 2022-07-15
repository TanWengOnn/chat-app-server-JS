//Create  connection
var socket = io.connect("http://localhost:5000"); // io.connect("http://192.168.100.195:5000");

//Query DOM
var message = $("#message");
var username = $("#username");
var btn = $("#send");
var output = $("#output");
var feedback = $("#feedback");

var typing = false;

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
  document.getElementById("message").addEventListener("keypress", (e) => {
    typing = true;
    console.log("keydown: " + typing);
  });

  document.getElementById("message").addEventListener("keyup", () => {
    typing = false;
    console.log("keyup: " + typing);
  });

  socket.emit("typing", {
    username: username.val(),
    typing: typing,
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
  if (data.typing === true) {
    document.getElementById("typing").removeAttribute("hidden");
    console.log("keydown");
    // view the console from the other clients
    console.log(data.typing);
  } else {
    document.getElementById("typing").setAttribute("hidden", "");
    document.getElementById("typing").innerHTML =
      data.username + " is typing...";
    console.log("keyup");
    // view the console from the other clients
    console.log(data.typing);
  }
});
