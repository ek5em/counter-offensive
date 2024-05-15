class MapObject {
    constructor({x, y, sizeX, sizeY, angle, type, hp}) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.angle = angle;
        this.type = type;
        this.hp = hp;
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

module.exports = MapObject;