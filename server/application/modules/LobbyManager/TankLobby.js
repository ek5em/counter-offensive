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
        this.type = [3, 4, 5].includes(roleId) ? 0 : 1;
        this.socketIds.push(socketId)

        switch (roleId) {
            case 3:
            case 7:
                this.gunnerId = user.id;
                break;
            case 4:
            case 6:
                this.driverId = user.id;
                break;
            case 5:
                this.commanderId = user.id;
                break;
        }
    }

    leaveTank(user) {
        // Удвлить игрока
        
    }
    
}

module.exports = TankLobby;