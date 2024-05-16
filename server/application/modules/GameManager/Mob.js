class Mob {
    constructor({x, y, type}) {
        this.type = type;
        this.hp = 8;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.path = [];
        this.pathUpdate = Date.now()
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
        if(Date.now() - this.reloadTimestamp > 100) {
            return true;
        }
        return false;
    }

    updateReloadtimestamp() {
        this.reloadTimestamp = Date.now()
    }

    setPath(path) {
        this.path = path;
    }

    checkDead() {
        if(this.hp < 0) {
            // Написать код смерти.
            return true;
        }
        return false;
    }

    damage(damage) {
        this.hp -= damage;
    }

}

module.exports = Mob;