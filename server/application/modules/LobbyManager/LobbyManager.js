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
        console.log(tank);
        if(tank.type === 1) await this.db.addMiddleTank(tank.driver_id, tank.gunner_id, 250);
        else await this.db.addHeavyTank(tank.driver_id, tank.gunner_id, tank.commander_id, 400);
    }



    async checkTank(tankId) {
        let tank = await this.db.getTankInLobbyById(tankId);
        tank = tank[0]; 
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
        if(gamerRank[0].level < minPersonLevel[0].level)
            return 234;

        let tank = [];
        console.log(tankId);
        
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
                is_free = !tank[0].gunner_id;
                break;
            case 4:
            case 6:
                is_free = !tank[0].driver_id;
                break;
            case 5:
                is_free = !tank[0].commander_id;
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
        if(nowPerson[0] !== undefined)
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
        if(gamerRank[0].level < minPersonLevel[0].level)
                return 234;

        if(nowPerson.length !== 0) {
            if(nowPerson[0].user_id != userId)
                return 236;
            if (gamerRank[0].gamer_exp > nowPerson[0].experience) 
                return 235;
        }        

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
            console.log(role)
            return await this.setTankRoleHandler(userId, role, tankId);
        }
        return 463;
    }
    

    async getGamer(userId) {
        let gamer = await this.db.getGamerById(userId);
        if(gamer[0].person_id != -1){
            if([3, 4, 5, 6, 7].includes(gamer[0].person_id)){
                let tank = await this.db.getTankByUserId(userId);
                if(tank[0]){
                    return {
                        "personId": gamer[0].person_id, 
                        "x": tank[0].x, 
                        "y": tank[0].y,
                        "angle": tank[0].angle, 
                        "towerAngle": tank[0].tower_angle,
                        "commanderAngle": tank[0].commander_angle
                    };
                }
                else return false;
            }
            return {
                "personId": gamer[0].person_id, 
                "x": gamer[0].x,
                "y": gamer[0].y, 
                "angle": gamer[0].angle
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
        if (hash[0].hashLobby !== oldHash) {
            await this.db.deleteEmptyTank();
            await this.checkRoleAvailability(userId);
            let tanks = await this.getTanks();
            let rank = await this.db.getRankById(userId);
            this.lobbyState.userInfo = {
                rank_name: rank[0].rank_name,
                gamer_exp: rank[0].gamer_exp,
                next_rang: rank[0].next_rang
            };
            this.lobbyState.tanks = tanks;
            this.lobbyState.is_alive = await this.getGamer(userId);
            return {lobby: this.lobbyState, lobbyHash: hash[0].hashLobby};
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
        if(tank[0]){
            switch(gamer[0].person_id){
                case 3:
                    this.suicideAndEndTanks(tank[0].commander_id, userId, tank[0].driver_id, tank[0].id);
                    break;
                case 4:
                    this.suicideAndEndTanks(tank[0].commander_id, tank[0].gunner_id, userId, tank[0].id);
                    break;
                case 5:
                    this.suicideAndEndTanks(tank[0].driver_id, tank[0].gunner_id, userId, tank[0].id);
                    break;
                case 6:
                    this.suicideAndEndTanks(tank[0].gunner_id, userId, null, tank[0].id);
                    break;
                case 7:
                    this.suicideAndEndTanks(tank[0].driver_id, userId, null, tank[0].id);
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