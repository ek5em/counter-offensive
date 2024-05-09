class Tank {
    constructor({ db, crypto, uuid}) {
        this.db = db;
        this.crypto = crypto;
        this.uuid = uuid;
        this.socketId = [socketId];
        // from DB
        this.type;
        this.hp;
        this.x;
        this.y;
        this.angle;
        this.gunnerId;
        this.driverId;
        this.commanderId;
        this.towerAngle;
    }

    addTank(type, gunnerId, driverId, commanderId = null) {
        this.hp = type ? 250 : 400;
        this.type = type;
        this.gunnerId = gunnerId;
        this.driverId = driverId;
        this.commanderId = commanderId;
    }
    
}

module.exports = Tank;