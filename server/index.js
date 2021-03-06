var express = require('express');
const open = require('open');

var app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static("public"));
app.use(express.static("public/game"));

const port = 5000;

(async() => {
    await open('http://localhost:' + port + '/');
})();

function getPublicPath() {
    var test = __dirname.split("\\");
    test.pop();
    test.push("public");
    return test.join("\\");
}

const requestListener = function(req, res) {
    res.end("Your IP Addresss is: " + req.socket.localAddress);
};

server.listen(port, 'localhost', () => { //SERVEUR
    console.log('Ecoute sur le port ' + port);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Room = require('./Room.js'); //Class pricnipales
Player = require('./Player.js');
require('./Target.js');

var players = []

var rooms = [] //On stocke les rooms

app.get('/', (req, res) => {
    //res.sendFile(getPublicPath() + "/game");
    //req.socket.localAddress;
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
            //console.log(rooms.length + " | " + room.id + " : " + room.players.length + " player(s)");
            //console.log(room.targets);
            //console.log("Update execution")
            io.volatile.to(room.id).emit('targets list', Object.values(room.targets)); //Actualise le jeu pour les clients pour chaque room
        }
    });
}
setInterval(update, 1000 / 60);

setInterval(function() { //generation des targets
    rooms.forEach(room => {
        console.log(rooms.length + " | " + room.id + " : " + room.players.length + " player(s)");
    });
}, 1000); //Recup id pour stop*/

setInterval(function() { //generation des targets
    rooms.forEach(room => {
        if (room.targets.length <= 10) room.generateTarget();
    });
}, 1000); //Recup id pour stop*/



io.on('connection', (socket) => {
    console.log("Bonjour " + socket.id); //Premi??re connexion
    players.push(new Player(socket.id, "guest" + socket.id));

    socket.on("disconnect", () => {
        console.log("Au revoir " + socket.id)

        let player = selectPlayer(socket.id);
        if (player.roomID != undefined) {
            let room = selectRoom(player.roomID);

            room.removePlayer(socket.id); //Player enlev?? du cache de la room

            io.to(room.id).emit('players list', Object.values(room.players)); //Liste refresh pour les joueurs restants

            socket.leave(player.roomID); //Deco de la room

            if (room.isEmpty()) {
                console.log("REMOVE IT !"); //////////////////////////////////////////////////////////////
                removeRoom(room.id);
            }
        }

        removePlayer(socket.id);
    });

    socket.on('coords click', function(coords) {
        console.log("Coords recu : X = " + coords.posX + " | Y = " + coords.posY)
        let x = coords.posX;
        let y = coords.posY;

        let player = selectPlayer(socket.id);
        //LOURD ?????????????
        if (player.roomID != undefined) {
            let room = selectRoom(player.roomID);

            let val = room.killTarget(x, y);
            if (val != undefined) {
                player.score += val;

                console.log(val);
                io.to(room.id).emit('players list', Object.values(room.players)); //Liste refresh
            }
        }


        //killTarget(x, y);
    });

    socket.on('create room', (roomID, pseudo) => {
        console.log("Create : " + roomID + " : " + io.sockets.adapter.rooms.has(roomID));
        if (!io.sockets.adapter.rooms.has(roomID)) {
            console.log("SUCCESS")
            io.to(socket.id).emit('room created', true);

            socket.join(roomID); //Le createur de la room la rejoint automatiquement

            let newRoom = new Room(roomID);
            let player = selectPlayer(socket.id);
            player.name = pseudo;

            console.log(pseudo);

            rooms.push(newRoom);
            newRoom.addPlayer(player);

            io.to(newRoom.id).emit('players list', Object.values(newRoom.players)); //Liste refresh
        } else {
            console.log("Failed")
            io.to(socket.id).emit('room created', false);
        }
    });

    socket.on('join room', (roomID, pseudo) => {
        console.log("Join : " + roomID + " : " + io.sockets.adapter.rooms.has(roomID));
        if (io.sockets.adapter.rooms.has(roomID) && selectPlayer(socket.id).roomID == undefined) {
            console.log("SUCCESS")
            io.to(socket.id).emit('room joined', true); //EMPECHER DE REJOINDRE LA MEME ??

            socket.join(roomID);
            let room = selectRoom(roomID);
            let player = selectPlayer(socket.id);
            player.name = pseudo;

            room.addPlayer(player); ///////

            io.to(room.id).emit('players list', Object.values(room.players)); //Liste refresh
        } else {
            console.log("Failed")
            io.to(socket.id).emit('room joined', false);
        }
    });

    socket.on('send message', (message) => {
        let player = selectPlayer(socket.id);

        console.log("Message de " + player.name + " : " + message);

        io.to(player.roomID).emit('message', player, message)
    })
})