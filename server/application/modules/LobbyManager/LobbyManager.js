const BaseModule = require('../BaseModule/BaseModule');
const { SOCKETS } = require("../../../config.js");

class LobbyManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);
        const { GET_USER } = this.Mediator.getTriggerTypes();
        this.lobbyState = {
            "bannerman": true
        };
        this.crypto = require('crypto');
        this.uuid = require('uuid');
    
        if (!this.io) {
            return;
        }

        io.on('connection', (socket) => {
            socket.on(SOCKETS.SET_GAMER_ROLE, (data) => this.registration(data, socket));
            socket.on(SOCKETS.GET_USER_INFO, (data) => this.getGamerInfo(data, socket));
            socket.on(SOCKETS.GET_LOBBY, (data) => this.getLobby(data, socket));
            socket.on(SOCKETS.SUICIDE, (data) => this.suicide(data, socket));
            socket.on(SOCKETS.TOKEN_VERIFICATION, (data) => this.tokenVerification(data, socket));
            socket.on('disconnect', () => console.log('disconnect', socket.id));
        });

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

        if(nowPerson.length !== 0 && gamerRank[0].gamer_exp < nowPerson[0].experience)
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

    

    async setGamerRole({userId, role, tankId}, socket) {
        if([1, 2, 8, 9].includes(role)){
            socket.emit(SOCKETS.SET_GAMER_ROLE, await this.setFootRoleHandler(userId, role));
            this.updateLobbyToAll();
        }
        if([3, 4, 5, 6, 7].includes(role)){
            socket.emit(SOCKETS.SET_GAMER_ROLE, await this.setTankRoleHandler(userId, role, tankId));
            this.updateLobbyToAll();
        }
        socket.emit(SOCKETS.SET_GAMER_ROLE, 463);
    }
    

    async getGamer(userId) {
        let gamer = await this.db.getGamerById(userId);
        if(gamer[0].person_id != -1){
            let person = await this.db.getPersonParamsById(gamer[0].person_id);
            if([3, 4, 5, 6, 7].includes(gamer[0].person_id)){
                let tank = await this.db.getTankByUserId(userId);
                if(tank[0]){
                    return {
                        "personId": gamer[0].person_id, 
                        "x": tank[0].x, 
                        "y": tank[0].y,
                        "angle": tank[0].angle, 
                        "towerAngle": tank[0].tower_angle,
                        "speed": person[0].movementSpeed,
                        "commanderAngle": tank[0].commander_angle
                    };
                }
                else return false;
            }
            return {
                "personId": gamer[0].person_id, 
                "x": gamer[0].x,
                "y": gamer[0].y, 
                "speed": person[0].movementSpeed,   
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
    
    async getGamerInfo({token}, socket) {

        const user = (this.db.getUserByToken(token))[0];
        const rank = (await this.db.getRankById(user.id))[0];
        let result = {
            id: user[0].id,
            token: token,
            login: login,
            nickname: nickname,
            rank_name: rank[0].rank_name,
            gamer_exp: rank[0].gamer_exp,
            next_rang: rank[0].next_rang,
            level: rank[0].level
        };
        result.is_alive = await this.getGamer(user.id);
        socket.emit(SOCKETS.GET_USER_INFO, result);
    }

    async getLobbyInfo() {
        await this.db.deleteEmptyTank();
        await this.checkRoleAvailability();
        let tanks = await this.getTanks();
        this.lobbyState.tanks = tanks;
    }

    async updateLobbyToAll() {
        this.getLobbyInfo();
        this.io.emit(SOCKETS.GET_LOBBY, {lobby: this.lobbyState});
    }

    async getLobby({}, socket) {
        this.getLobbyInfo();
        socket.emit(SOCKETS.GET_LOBBY, {lobby: this.lobbyState});
        
    }


    async suicideAndEndTanks(target1Id, target2Id, userId, tankId) {
        await this.db.suicide(target1Id);
        if(target2Id) await this.db.suicide(target2Id);
        if(userId) await this.db.suicide(userId);
        await this.db.endTankGame(tankId);
    }
    

    async suicide({userId}, socket) {
        const user = (await userManager.getUser(token))[0];
        if (user && user.token) {
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
                this.updateLobbyToAll();
            }

            else {
                await this.db.suicide(userId);
                this.updateLobbyToAll();
            }
            const hashLobby = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
            await this.db.updateLobbyHash(hashLobby);
            socket.emit(SOCKETS.SUICIDE, true);
        } else socket.emit(SOCKETS.SUICIDE, 401);;
    }
    
}

module.exports = LobbyManager;