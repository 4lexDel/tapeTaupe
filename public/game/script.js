const socket = io();

$(document).ready(function() {
    $("#gameContent").hide();
});

function joinRoom() {
    //document.getElementById("result").innerHTML = "Room create successfuly !";
    value = $("#inputRoomID").val();

    socket.emit("join room", value);

    socket.on("room joined", (state) => {
        if (state) {
            $("#result").html('<div  class="alert alert-success" role="alert">Room join successfuly !</div>');
            loadGame($("#homeContent"));
        } else {
            $("#result").html('<div  class="alert alert-danger" role="alert">Failed !</div>');
        }
    });
}
//RECUP LISTE ROOM ?

function createRoom() {
    //console.log("Create room");
    value = $("#inputRoomID").val();

    if (value != "") {
        socket.emit("create room", value);
    } else {
        $("#result").html('<div  class="alert alert-warning" role="alert">Input empty !</div>');
    }

    socket.on("room created", (state) => {
        if (state) {
            $("#result").html('<div  class="alert alert-success" role="alert">Room create successfuly !</div>');
            loadGame($("#homeContent"));
        } else {
            $("#result").html('<div  class="alert alert-danger" role="alert">Failed !</div>');
        }
    });
    //capturer erreur
}

function loadGame(fromElement) {
    console.log("LoadGame");

    fromElement.hide();

    $("#gameContent").show();
}