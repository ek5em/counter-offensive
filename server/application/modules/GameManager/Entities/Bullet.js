class Bullet {
    constructor({userId, x, y, dx, dy, type}) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    move() {
        this.x+=this.dx;
        this.y+=this.dy;
    }

    kill() {
        //
    }

}

module.exports = Bullet;