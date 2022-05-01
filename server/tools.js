module.exports = {
    getRandomInt: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    distance: distance = function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
    },

    checkCollision: function(x, y, target) {
        if (this.distance(x, y, target.x, target.y) <= target.r) return true;
        return false;
    }
}