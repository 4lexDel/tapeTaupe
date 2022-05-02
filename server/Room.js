const Target = require('./Target.js');
const { checkCollision } = require('./tools.js');

require('./Target.js');
require('./Player.js');

module.exports = function(id) {
    this.id = id;

    this.players = [];
    this.targets = [];

    this.addPlayer = function(player) {
        player.roomID = this.id;
        this.players.push(player);
    }

    this.removePlayer = function(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) {
                console.log(i);
                console.log('test delete ' + this.players);
                this.players = this.players.slice(0, i).concat(this.players.slice(i + 1));
                console.log('test delete ' + this.players);
                return true;
            }
        }
        return false;
    }

    this.isEmpty = function() {
        if (this.players.length <= 0) return true;
        return false;
    }

    this.generateTarget = function() {
        //console.log("add : " + targets.length);               //Ajout de "taupes"
        this.targets.push(new Target(50, true, 1));
    }

    this.killTarget = function(x, y) {
        for (let i = 0; i < this.targets.length; i++) {
            if (checkCollision(x, y, this.targets[i])) {
                this.targets.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}