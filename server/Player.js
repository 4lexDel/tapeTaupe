module.exports = class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.roomId;
        this.score = 0;
    }
}