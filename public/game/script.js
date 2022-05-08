//const socket = io.connect('http://192.168.1.69:5000');
const socket = io();

$(document).ready(function() {
    $("#gameContent").hide();
});

function joinRoom() {
    //document.getElementById("result").innerHTML = "Room create successfuly !";
    value = $("#inputRoomID").val();
    pseudo = $("#inputPseudoID").val();

    socket.emit("join room", value, pseudo);
}
//RECUP LISTE ROOM ?

socket.on("room joined", (state) => {
    if (state) {
        $("#result").html('<div  class="alert alert-success" role="alert">Room join successfuly !</div>');
        loadGame($("#homeContent"));
    } else {
        $("#result").html('<div  class="alert alert-danger" role="alert">Failed !</div>');
    }
});

function createRoom() {
    //console.log("Create room");
    value = $("#inputRoomID").val();
    pseudo = $("#inputPseudoID").val();

    if (value != "") {
        socket.emit("create room", value, pseudo);
    } else {
        $("#result").html('<div  class="alert alert-warning" role="alert">Input empty !</div>');
    }
    //capturer erreur
}

socket.on("room created", (state) => {
    if (state) {
        $("#result").html('<div  class="alert alert-success" role="alert">Room create successfuly !</div>');
        loadGame($("#homeContent"));
    } else {
        $("#result").html('<div  class="alert alert-danger" role="alert">Failed !</div>');
    }
});

function loadGame(fromElement) {
    console.log("LoadGame");

    fromElement.hide();

    $("#gameContent").show();
}