const BaseEntity = require("./Entities/BaseEntity");
class Bullet extends BaseEntity{
    constructor({userId, x, y, dx, dy, type}) {
        this.userId = userId;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.type = type;
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