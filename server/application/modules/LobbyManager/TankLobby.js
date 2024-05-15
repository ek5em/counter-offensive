const { heavyTankRoles, gamerRoles } = require("../../../config");

class TankLobby {
    constructor({ db, crypto, uuid}) {
        this.db = db;
        this.crypto = crypto;
        this.uuid = uuid;
        this.socketIds = [];
        // from DB
        this.type;
        this.gunnerId;
        this.driverId;
        this.commanderId;
    }

    get() {
        return {
            id : this.id,
            type : this.type,
            gunnerId : this.gunnerId,
            driverId : this.driverId,
            commanderId : this.commanderId,
        }
    }

    addGamer(user, roleId, socketId) {
        this.type = heavyTankRoles.includes(roleId) ? 0 : 1;
        this.socketIds.push(socketId);

        switch (roleId) {
            case gamerRoles.heavyTankGunner:
            case gamerRoles.middleTankGunner:
                this.gunnerId = user.id;
                break;
            case gamerRoles.heavyTankMeh:
            case gamerRoles.middleTankMeh:
                this.driverId = user.id;
                break;
            case gamerRoles.heavyTankCommander:
                this.commanderId = user.id;
                break;
        }
    }

    leaveTank(user) {
        // Удвлить игрока
        
    }
    
}

module.exports = TankLobby;