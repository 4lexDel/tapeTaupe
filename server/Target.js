const tools = require('./tools.js');
const conf = require('./conf.js');

module.exports = function(r, type, value) {
    this.x = tools.getRandomInt(0, conf.width);
    this.y = tools.getRandomInt(0, conf.height);

    this.r = r;
    this.type = type;
    this.value = value;
}