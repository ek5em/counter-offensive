class Tank {
    constructor({ db, crypto, uuid}) {
        this.db = db;
        this.crypto = crypto;
        this.uuid = uuid;
        this.socketId = [socketId];
        this.type;
        this.hp;
        this.x;
        this.y;
        this.angle = 0;
        this.reloadTimestamp;
        this.gunnerId;
        this.driverId;
        this.commanderId;
        this.towerAngle = 0;
        this.commanderAngle = 0;
    }

    addTank(type, gunnerId, driverId, commanderId = null) {
        this.hp = type ? 250 : 400;
        this.type = type;
        this.gunnerId = gunnerId;
        this.driverId = driverId;
        this.commanderId = commanderId;
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

    motion(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
 
    rotateTower(angle) {
        this.towerAngle = angle;
    }

    commanderRotate(angle) {
        this.commanderAngle = angle;
    }
}

module.exports = Tank;