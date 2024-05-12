class Mob {
    constructor({id, x, y, type}) {
        this.type = type;
        this.hp = 8;
        this.x = 5;
        this.y = 5;
        this.angle = 0;
        this.reloadTimestamp = Date.now();
    }

    move(dx, dy) {
        this.x+=dx;
        this.y+=dy;
    }

    rotate(angle) {
        this.angle = angle;
    }

    fire() {
        this.reloadTimestamp = Date.now();
    }

}

module.exports = Mob;