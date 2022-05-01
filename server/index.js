var express = require('express');
var path = require('path');
const open = require('open');

const resolve = require('path').resolve;

var app = express();

//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(resolve("./public/")));
app.use(express.static("public"));
app.use(express.static("public/home"));
app.use(express.static("public/game"));
//app.use(express.static(resolve("./public/game/")));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

(async() => {
    await open('http://localhost:3000/');
})();

function getPublicPath() {
    var test = __dirname.split("\\");
    test.pop();
    test.push("public");
    return test.join("\\");
}

server.listen(3000, 'localhost', () => { //SERVEUR
    console.log('Ecoute sur le port 3000');

    //console.log(__dirname.split("\\").pop());
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const tools = require('./tools.js');
const Target = require('./Target.js');
const Room = require('./Room.js');
const Player = require('./Player.js');

var players = []

rooms = [] //On stocke les rooms

app.get('/', (req, res) => {
    res.sendFile(getPublicPath() + "/home");
    //res.sendFile(getPublicPath() + "/game/game.html");
});

function removeRoom(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) rooms.splice(i, 1); //MODULER ==> voir passage par ref ???????
    }
}

function removePlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) players.splice(i, 1);
    }
}

function selectPlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) return players[i];
    }
}

function selectRoom(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) return rooms[i];
    }
}

function update() {
    rooms.forEach(room => {
        if (room.targets.length > 0) {
            console.log(room.id + " : " + room.targets.length);
            //console.log(room.targets);
            //console.log("Update execution")
            io.volatile.to(room.id).emit('targets list', Object.values(room.targets)); //Actualise le jeu pour les clients pour chaque room
        }
    });
}
setInterval(update, 1000 / 60);

setInterval(function() { //generation des targets
    rooms.forEach(room => {
        room.generateTarget();
    });
}, 1000); //Recup id pour stop*/



io.on('connection', (socket) => {
    console.log("Bonjour " + socket.id);
    players.push(new Player(socket.id, "guest"));

    socket.on("disconnect", () => {
        console.log("Au revoir " + socket.id)

        player = selectPlayer(socket.id);
        if (player.roomID != undefined) {
            let room = selectRoom(player.roomID);

            room.removePlayer(socket.id); //Player enlevé du cache de la room
            socket.leave(room.id); //Deco de la room
        }

        removePlayer(socket.id);
    });

    socket.on('coords click', function(coords) {
        console.log("Coords recu : X = " + coords.posX + " | Y = " + coords.posY)
        let x = coords.posX;
        let y = coords.posY;

        player = selectPlayer(socket.id);
        //LOURD ?????????????
        if (player.roomID != undefined) {
            let room = selectRoom(player.roomID);
            room.killTarget(x, y);
        }


        //killTarget(x, y);
    });

    socket.on('create room', (roomID) => {
        console.log("Create : " + roomID + " : " + io.sockets.adapter.rooms.has(roomID));
        if (!io.sockets.adapter.rooms.has(roomID)) {
            console.log("SUCCESS")
            io.to(socket.id).emit('room created', true);
            socket.join(roomID); //Le createur de la room la rejoint automatiquement

            let newRoom = new Room(roomID);

            rooms.push(newRoom);
            newRoom.addPlayer(selectPlayer(socket.id));
        } else {
            console.log("Failed")
            io.to(socket.id).emit('room created', false);
        }
    });

    socket.on('join room', (roomID) => {
        console.log("Join : " + roomID + " : " + io.sockets.adapter.rooms.has(roomID));
        if (io.sockets.adapter.rooms.has(roomID) && selectPlayer(socket.id).roomID == undefined) {
            console.log("SUCCESS")

            io.to(socket.id).emit('room joined', true); //EMPECHER DE REJOINDRE LA MEME ??
            socket.join(roomID);
            let room = selectRoom(roomID);
            room.addPlayer(selectPlayer(socket.id)); ///////
        } else {
            console.log("Failed")
            io.to(socket.id).emit('room joined', false);
        }
    });
})