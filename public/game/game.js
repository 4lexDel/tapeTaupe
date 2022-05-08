//const socket = io();

console.log("begin ! ");

function sendMessage() {
    message = $("#inputMessageID").val();
    $("#inputMessageID").val("");


    if (message != "") {
        socket.emit("send message", message);
    }
}

socket.on('message', (player, message) => {
    let author = "otherMessage";
    if (player.id == socket.id) author = "myMessage";

    let msgHTML = '<div class="message ' + author + '">' + player.name + ' : ' + message + '</div>';
    console.log("MSG RECEIVE !");
    $('#chatArea').append(msgHTML);
})

socket.on('targets list', function(list) {
    targets = list;
    //console.log("Graph refresh");
});

socket.on('players list', function(list) {
    players = list;
    console.log("Player list refresh");

    refreshPlayerList(list);
});

function refreshPlayerList(players) {
    let htmlContent = "<ul>";

    players.forEach(player => {
        htmlContent += "<li>" + player.name + " : " + player.score + "</li>";
    });
    htmlContent += "</ul>";

    $("#playerList").html(htmlContent);
}

let targets = [];

const ctx = canvas.getContext('2d');

function drawTargets() {
    targets.forEach(function({ x, y, r, type, value }) {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
        if (type) ctx.fillStyle = 'green';
        else ctx.fillStyle = 'red';

        ctx.fill();
        //console.log("draw");
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTargets();
    requestAnimationFrame(update);
}
// first call
requestAnimationFrame(update);

$("canvas").click(function(event) {
    x = event.offsetX;
    y = event.offsetY;

    console.log("Client X : " + event.offsetX + " | Y : " + event.offsetY);
    socket.volatile.emit('coords click', { posX: x, posY: y });
});
























///////////////////////////////////

/*const keyboard = {};

window.onkeydown = function(e) {
    keyboard[e.key] = true;
};

window.onkeyup = function(e) {
    delete keyboard[e.key];
};

function movePlayer() {
    //if (keyboard['ArrowLeft']) socket.emit('move left');
    //if (keyboard['ArrowUp']) socket.emit('move up');
    //if (keyboard['ArrowRight']) socket.emit('move right');
    //if (keyboard['ArrowDown']) socket.emit('move down');
}*/