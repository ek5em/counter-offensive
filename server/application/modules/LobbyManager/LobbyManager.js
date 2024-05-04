const BaseModule = require('../BaseModule/BaseModule');

class LobbyManager{
    constructor(db){
        this.db = db;
        this.lobbyState = {
            "general": true,
            "bannerman": true
        };
        this.crypto = require('crypto');
        this.uuid = require('uuid');
    }

    tankRoleField(roleId){
        if (roleId === 3 || roleId === 7) 
            return 'gunner_id';
        else if (roleId === 4 || roleId === 6)
            return 'driver_id';
        else if (roleId === 5) 
            return 'commander_id';

    }
    

    async checkRoleAvailability(userId) {
        this.lobbyState = {
            general: true,
            bannerman: true
        };
        let lobby = await this.db.getLobby();
        let gamerRank = await this.db.getRankById(userId);
        for(let role of lobby) {
            switch(role.person_id){
                case 1: 
                    if(role.experience < gamerRank.gamer_exp) 
                        this.lobbyState.general = true;
                    else
                        this.lobbyState.general = false;
                    break;
                case 2: 
                    this.lobbyState.bannerman = false;
                    break;
            }
        }
    }


    async addTank(tank) {
        await this.db.deleteTank(tank.id);
        if(tank.type === 1) await this.db.addMiddleTank(tank.driver_id, tank.gunner_id, 250);
        else await this.db.addHeavyTank(tank.driver_id, tank.gunner_id, tank.commander_id, 400);
    }



    async checkTank(tankId) {
        let tank = await this.db.getTankInLobbyById(tankId);
        tank = tank; 
        if ((tank.type === 1 && tank.gunner_id && tank.driver_id) ||
        (tank.type === 0 && tank.gunner_id && tank.driver_id && tank.commander_id)){
            this.addTank(tank); 
        }
    }


    async addGamer(userId, roleId) {
        await this.db.deleteGamerInTankLobby(userId);
        if(!(await this.db.checkLiveGamer().status_exists)) await this.db.setStartGameTimestamp();
        await this.db.setGamerRole(userId, roleId, 8);
        let hashLobby = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        await this.db.updateLobbyHash(hashLobby);
    }



    async setTankRoleHandler(userId, roleId, tankId) {
        
        let gamerRank = await this.db.getRankById(userId);
        let minPersonLevel = await this.db.getMinPersonLevelById(roleId);
        
        // Проверка доступности роли
        if(gamerRank.level < minPersonLevel.level)
            return 234;

        let tank = [];
        
        // Проверка наличия танкайди
        if(tankId && typeof tankId !== 'number') tank = await this.db.getTankInLobbyById(tankId);
 
        if (tank.length === 0){
            this.addGamer(userId, roleId);
            let tankType = [3, 4, 5].includes(roleId) ? 0 : 1; 
            let tankRoleField = this.tankRoleField(roleId);
            await this.db.createNewTankInLobby(userId, tankRoleField, tankType);
            return true;
        }

        let is_free = false;
        switch(roleId) {
            case 3:
            case 7:
                is_free = !tank.gunner_id;
                break;
            case 4:
            case 6:
                is_free = !tank.driver_id;
                break;
            case 5:
                is_free = !tank.commander_id;
                break;
        }
        if (!is_free) 
            return 238;

        this.addGamer(userId, roleId);
        let tankRoleField = this.tankRoleField(roleId);
        await this.db.setGamerInTankLobby(userId, tankRoleField, tankId);
        await this.checkTank(tankId);
        let hashLobby = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        this.db.updateLobbyHash(hashLobby);
        return true;       
    }
    
    
    async setBannerman(userId) {
        let roleId = 2;

        // Данные для проверки доступности роли
        let nowPerson = await this.db.getPerson(roleId);

        // Проверка доступности роли
        if(nowPerson !== undefined)
            return 237;

        // Подготовка к установке роли
        this.addGamer(userId, roleId);
        return true;

    }
    

    async setGeneral(userId) {
        let roleId = 1;

        // Данные для проверки доступности роли
        let nowPerson = await this.db.getPerson(roleId);
        let gamerRank = await this.db.getRankById(userId);
        let minPersonLevel = await this.db.getMinPersonLevelById(roleId);

        // Проверка доступности роли
        if(gamerRank.level < minPersonLevel.level)
            return 234;

        if(nowPerson.length !== 0 && gamerRank.gamer_exp < nowPerson.experience)
            return 235;

        // Подготовка к установке роли
        await this.db.deleteRole(1);
        this.addGamer(userId, roleId);
    }


    async setFootRoleHandler(userId, roleId) {
        // Установка пехотина(РПГшника)
        if([8, 9].includes(roleId)){
            this.addGamer(userId, roleId);
            return true;
        }
        else if([1, 2].includes(roleId)){
            if(roleId === 1){
                return this.setGeneral(userId);
            }
            else if(roleId === 2) {
                return this.setBannerman(userId);
            }
        }
    }

    

    async setGamerRole(userId, role, tankId) {
        if([1, 2, 8, 9].includes(role)){
            return await this.setFootRoleHandler(userId, role);
        }
        if([3, 4, 5, 6, 7].includes(role)){
            return await this.setTankRoleHandler(userId, role, tankId);
        }
        return 463;
    }
    

    async getGamer(userId) {
        let gamer = await this.db.getGamerById(userId);
        if(gamer.person_id != -1){
            let person = await this.db.getPersonParamsById(gamer.person_id);
            if([3, 4, 5, 6, 7].includes(gamer.person_id)){
                let tank = await this.db.getTankByUserId(userId);
                if(tank){
                    return {
                        "personId": gamer.person_id, 
                        "x": tank.x, 
                        "y": tank.y,
                        "angle": tank.angle, 
                        "towerAngle": tank.tower_angle,
                        "speed": person.movementSpeed,
                        "commanderAngle": tank.commander_angle
                    };
                }
                else return false;
            }
            return {
                "personId": gamer.person_id, 
                "x": gamer.x,
                "y": gamer.y, 
                "speed": person.movementSpeed,   
                "angle": gamer.angle
            };
        }
        else return false;
    }


    async getTanks() {
        let heavyTank = [];
        let middleTank = [];
        heavyTank = await this.db.getHeavyTank();
        heavyTank = heavyTank.map(obj => {
            return {
              ...obj,
              Mechanic: obj.Mechanic === 'true',
              Gunner: obj.Gunner === 'true',
              Commander: obj.Commander === 'true'
            };
          });

        middleTank = await this.db.getMiddleTank();        
        middleTank = middleTank.map(obj => {
            return {
              ...obj,
              Mechanic: obj.Mechanic === 'true',
              Gunner: obj.Gunner === 'true'
            };
          });

        return {heavyTank: heavyTank, middleTank:middleTank};
    }
    

    async getLobby(userId, oldHash) {
        let hash = await this.db.getGame();  
        if (hash.hashLobby !== oldHash) {
            await this.db.deleteEmptyTank();
            await this.checkRoleAvailability(userId);
            let tanks = await this.getTanks();
            let rank = await this.db.getRankById(userId);
            this.lobbyState.userInfo = {
                rank_name: rank.rank_name,
                gamer_exp: rank.gamer_exp,
                next_rang: rank.next_rang
            };
            this.lobbyState.tanks = tanks;
            this.lobbyState.is_alive = await this.getGamer(userId);
            return {lobby: this.lobbyState, lobbyHash: hash.hashLobby};
        }
        return true;
    }


    async suicideAndEndTanks(target1Id, target2Id, userId, tankId) {
        await this.db.suicide(target1Id);
        if(target2Id) await this.db.suicide(target2Id);
        if(userId) await this.db.suicide(userId);
        await this.db.endTankGame(tankId);
    }
    

    async suicide(userId) {
        let gamer = await this.db.getGamerById(userId);
        let tank = await this.db.getTankByUserId(userId);
        if(tank){
            switch(gamer.person_id){
                case 3:
                    this.suicideAndEndTanks(tank.commander_id, userId, tank.driver_id, tank.id);
                    break;
                case 4:
                    this.suicideAndEndTanks(tank.commander_id, tank.gunner_id, userId, tank.id);
                    break;
                case 5:
                    this.suicideAndEndTanks(tank.driver_id, tank.gunner_id, userId, tank.id);
                    break;
                case 6:
                    this.suicideAndEndTanks(tank.gunner_id, userId, null, tank.id);
                    break;
                case 7:
                    this.suicideAndEndTanks(tank.driver_id, userId, null, tank.id);
                    break;
            }
        }
        else {
            await this.db.suicide(userId);
        }
        const hashLobby = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        await this.db.updateLobbyHash(hashLobby);
        return true;
    }
    
}

module.exports = LobbyManager;