const BaseModule = require("../BaseModule/BaseModule");
const TankLobby = require("./TankLobby.js");
const Tank = require("../GameManager/Tank.js")
const { SOCKETS } = require("../../../config.js");

class LobbyManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);

        this.nowTankId = 1;
        this.heavyTanks = {};
        this.middleTanks = {};

        this.ranks = {};
        this.initRanks();

        
        this.roles = {}
        this.initRoles(); 

        this.startGameTime;

        if (!this.io) {
            return;
        }

        io.on("connection", (socket) => {
            socket.on(SOCKETS.SET_GAMER_ROLE, (data) =>
                this.setGamerRole(data, socket)
            );
            socket.on(SOCKETS.GET_USER_INFO, (data) =>
                this.getUserInfo(data, socket)
            );
            socket.on(SOCKETS.GET_LOBBY, (data) => this.getLobby(data, socket));
            socket.on(SOCKETS.SUICIDE, (data) => this.suicide(data, socket));
            socket.on("disconnect", () => console.log("disconnect", socket.id));
        });
    }

    async initRanks() {
        const ranks = await this.db.getRanks();
        this.ranks = ranks.reduce((acc, rank) => {
            acc[rank.experience] = {
                rankName: rank.name,
                level: rank.id
            } 
            return acc;
        }, {});
    }

    async initRoles() {
        const roles = await this.db.getPersons();
        this.roles = roles.reduce((acc, roles) => {
            acc[roles.id] = {
                name: roles.name,
                hp: roles.hp,
                image: roles.image,
                reloadSpeed: roles.reloadSpeed,
                movementSpeed: roles.movementSpeed,
                rotateSpeed: roles.rotateSpeed,
                level: roles.level,
            };
            return acc;
        }, {});
    }

    getRankByExperience(experience) {
        for (const [exp, rank] of Object.entries(this.ranks).sort(([a], [b]) => b - a)) {
            if (experience >= exp) {
                for(const [nextExp, nextRank] of Object.entries(this.ranks)) {
                    if(nextRank.level === rank.level + 1) {
                        return {
                            ...rank,
                            nextRank: nextExp - experience
                        };
                    }
                }
            }
        }
    }
    
    tankRoleField(roleId) {
        if (roleId === 3 || roleId === 7) {
            return "gunner_id";
        }
        if (roleId === 4 || roleId === 6) {
            return "driver_id";
        }
        if (roleId === 5) {
            return "commander_id";
        }
    }

    checkBannermanAvailability() {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);

        for(const user of Object.entries(users)) {
            if (user.role === 2) {
                return false;
            }
        }
        return true;
    }

    addTank(tank, tankId) {
        const gameTanks = this.mediator.get(this.TRIGGERS.GAME_TANKS);
        const gameTank = new Tank({ db: this.db });
        if (tank.type) {
            gameTank.addTank(tank.type,  tank.driverId, tank.gunnerId)
            delete this.middleTanks[tankId];
        } else {
            gameTank.addTank(tank.type,  tank.driverId, tank.gunnerId, tank.commanderId)
            delete this.heavyTanks[tankId];
        }
        gameTanks[tank.id] = gameTank;
    }

    deleteEmptyTank() {
        for (const [id, tank] of Object.entries(this.heavyTanks)) {
            if (!tank.driverId && !tank.gunnerId && !tank.commanderId) {
                console.log(this.heavyTanks[id])
                delete this.heavyTanks[id]
            }
        }

        for (const [id, tank] of Object.entries(this.middleTanks)) {
            if (!tank.driverId && !tank.gunnerId) {
                delete this.middleTanks[id]
            }
        }
    }

    checkTank(tankId) {
        const tanks = { ...this.heavyTanks, ...this.middleTanks };

        const tank = tanks[tankId];
        if (
            (tank.type && tank.gunnerId && tank.driverId) ||
            (!tank.type &&
                tank.gunnerId &&
                tank.driverId &&
                tank.commanderId)
        ) {
            this.addTank(tank, tankId);
        }
    }


    
    // Когда будет готовая игра на активных записях переделать.
    addGamer(user, roleId) {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        if(Object.values(users).find(user => user.roleId)) {
            this.startGameTime = Date.now();
        }
        this.deleteGamerFromTankLobby(user.id);
        user.addToGame(roleId);
    }

    deleteGamerFromTankLobby(userId) {
        const tanks = { ...this.heavyTanks, ...this.middleTanks };
        const tank = Object.values(tanks).find(tank => tank.driverId === userId || tank.gunnerId === userId || tank.commanderId === userId);
        if(!tank) {
            return;
        }
        if(tank.driverId === userId) {
            tank.driverId = null;
        } else if(tank.gunnerId === userId) {
            tank.gunnerId = null;
        } else if(tank.commanderId === userId) {
            tank.commanderId = null; 
        }
    }

    setTankRoleHandler(user, roleId, tankId) {
        console.log(tankId)
        const gamerRank = this.getRankByExperience(user.experience);
        const minPersonLevel = this.roles[roleId];
        // Проверка доступности роли
        if (gamerRank.level < minPersonLevel.level) {
            return 234;
        }

        if (user.roleId === roleId) {
            return 236;
        }

        const tanks = { ...this.heavyTanks, ...this.middleTanks };

        // Проверка наличия танкайди
        if (!tankId){
            console.log('dasdsadasd');
            const tank = new TankLobby({
                db: this.db, 
                crypto: this.crypto,
                uuid: this.uuid
            });
            this.addGamer(user, roleId);
            tank.addGamer(user, roleId);
            if(tank.type) {
                this.middleTanks[this.nowTankId] = tank;
            } else {
                this.heavyTanks[this.nowTankId] = tank;
            }
            this.nowTankId++;
            return true;
        }

        const tank = tanks[tankId];
        let is_free = false;
        switch (roleId) {
            case 3:
            case 7:
                is_free = !tank.gunnerId;
                break;
            case 4:
            case 6:
                is_free = !tank.driverId;
                break;
            case 5:
                is_free = !tank.commanderId;
                break;
        }
        
        if (!is_free) {
            return 238;
        } 

        this.addGamer(user, roleId);
        tank.addGamer(user, roleId);
        if(tank.type) {
            this.middleTanks[tankId] = tank;
        } else {
            this.heavyTanks[tankId] = tank;
        }
        this.checkTank(tankId);
        return true;
    }

    setBannerman(user) {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        if(!Object.values(users).find(user => user.roleId === 2)) {
            this.addGamer(user, 2);
            return true;
        }
        return 237;

    }

    setGeneral(user) {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        const nowPerson = Object.values(users).find(user => user.roleId === 1);
        const gamerRank = this.getRankByExperience(user.experience);
        const minPersonLevel = this.roles[1];

        // Проверка доступности роли
        if (gamerRank.rank < minPersonLevel.level) {
            return 234;
        }

        if (nowPerson) {
            if(user.experience < nowPerson.experience) {
                return 235;
            }
            // Подготовка к установке роли
            delete this.users[nowPerson.id];
        }
      
        this.addGamer(user, 1);
        return true;
    }

    async setFootRoleHandler(user, roleId) {
        // Установка пехотина(РПГшника)
        if ([8, 9].includes(roleId)) {
            this.addGamer(user, roleId);
            return true;
        } else if ([1, 2].includes(roleId)) {
            if (roleId === 1) {
                return this.setGeneral(user);
            } else if (roleId === 2) {
                return this.setBannerman(user);
            }
        }
    }

    setGamerRole(data = {}, socket) {
        const { token, role, tankId } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, token);

        if (user && user.token) {
            if ([1, 2, 8, 9].includes(role)) {
                const setRole = this.setFootRoleHandler(user, role);
                if (Number.isInteger(setRole)) {
                    socket.emit(SOCKETS.ERROR, this.answer.bad(setRole));
                } else {
                    socket.emit(
                        SOCKETS.SET_GAMER_ROLE,
                        this.answer.good(setRole)
                    );
                    this.updateLobbyToAll();
                }
                return;
                    
            } else if ([3, 4, 5, 6, 7].includes(role)) {
                const setRole = this.setTankRoleHandler(
                    user,
                    role,
                    tankId
                );
                if (Number.isInteger(setRole))
                    socket.emit(SOCKETS.ERROR, this.answer.bad(setRole));
                else {
                    const tank = this.getTankByUserId(user.id);
                    
                    this.updateLobbyToAll();
                    // Нужно сделать так что бы всем танкам отправлялось сообщение если танк заполнился
                    socket.emit(
                        SOCKETS.SET_GAMER_ROLE,
                        this.answer.good({ tankId: Number(tank.id), tankType: tank.type })
                    );
                    this.updateLobbyToAll();
                }
                return;
            } else {
                socket.emit(SOCKETS.ERROR, this.answer.bad(463));
                return ;
            }
        } else {
            socket.emit(SOCKETS.ERROR, this.answer.bad(401));
            return; 
        } 
    }

    getTankByUserId(userId){
        const tanks = { ...this.heavyTanks, ...this.middleTanks };
        for (const [id, tank] of Object.entries(tanks)) {
            if(tank.driverId === userId || tank.gunnerId === userId || tank.commanderId === userId) {
                return {
                    ...tank,
                    id
                }
            }
        }
    }

    getGamer(user) {
        if (user.roleId) {
            let role = this.roles[user.roleId];
            if ([3, 4, 5, 6, 7].includes(user.roleId)) {
                let tank = this.getTankByUserId(user.id);
                if (tank) {
                    return {
                        personId: user.roleId,
                        x: tank.x,
                        y: tank.y,
                        angle: tank.angle,
                        towerAngle: tank.tower_angle,
                        speed: role.movementSpeed,
                        commanderAngle: tank.commander_angle,
                    };
                } else {
                    return false;
                } 
            }
            return {
                personId: user.roleId,
                x: user.x,
                y: user.y,
                speed: role.movementSpeed,
                angle: user.angle,
            };
        } else {
            return false;
        }
    }

    getTanks() {
        const heavyTank = [];
        const middleTank = [];
    
        for (const id in this.heavyTanks) {
            const tank = this.heavyTanks[id];
            heavyTank.push({
                id: Number(id),
                Mechanic: !!tank.driverId,
                Gunner: !!tank.gunnerId,
                Commander: !!tank.commanderId,
            });
        }
    
        for (const id in this.middleTanks) {
            const tank = this.middleTanks[id];
            middleTank.push({
                id: Number(id),
                Mechanic: !!tank.driverId,
                Gunner: !!tank.gunnerId,
            });
        }
    
        return { heavyTank: heavyTank, middleTank: middleTank };
    }
    

    getUserInfo(data = {}, socket) {
        const { token } = data;
        const { GET_USER } = this.mediator.getTriggerTypes();
        const user = this.mediator.get(GET_USER, token);
        if (user && user.token) {
            const rank = this.getRankByExperience(user.experience);
            const result = {
                id: user.id,
                token: token,
                login: user.login,
                nickname: user.nickname,
                rank_name: rank.rankName,
                gamer_exp: user.experience,
                next_rank: rank.nextRank
            };
            result.is_alive = this.getGamer(user);
            socket.emit(SOCKETS.GET_USER_INFO, this.answer.good(result));
        } else {
            socket.emit(SOCKETS.ERROR, this.answer.bad(401));
        }
    }

    // Дописать
    getLobbyInfo() {

        this.deleteEmptyTank();
        const bannermanAvailability = this.checkBannermanAvailability();
        const tanks = this.getTanks();
        
        return {
            bannerman: bannermanAvailability,
            tanks: tanks
        }
    }

    // Дописать
    updateLobbyToAll() {
        const lobbyState = this.getLobbyInfo();
        this.io.emit(SOCKETS.GET_LOBBY, this.answer.good(lobbyState));
        return ;
    }

    getLobby(data = {}, socket) {
        const { token } = data
        const user = this.mediator.get(this.TRIGGERS.GET_USER, token);

        if (user && user.token) {
            const lobbyState = this.getLobbyInfo();
            socket.emit(SOCKETS.GET_LOBBY, this.answer.good(lobbyState));
            return;
        } else socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }

    suicideAndEndTanks(target1Id, target2Id, userId, tankId) {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        const gameTanks = this.mediator.get(this.TRIGGERS.GAME_TANKS);
        users[target1Id].suicide();
        if (target2Id) {
            users[target2Id].suicide();
        }
        if (userId) {
            users[userId].suicide();
        }
        delete gameTanks[tankId]
        
    }

    async suicide(data = {}, socket) {
        const { token } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, token);
        if (user && user.token) {
            // Так же дописать метод который будет получать танк по юзерайди
            const tank = this.getTankByUserId(user.id);
            if (tank) {
                switch (gamer.roleId) {
                    case 3:
                        this.suicideAndEndTanks(
                            tank.commanderId,
                            user.id,
                            tank.driverId,
                            tank.id
                        );
                        break;
                    case 4:
                        this.suicideAndEndTanks(
                            tank.commanderId,
                            tank.gunnerId,
                            user.id,
                            tank.id
                        );
                        break;
                    case 5:
                        this.suicideAndEndTanks(
                            tank.driverId,
                            tank.gunnerId,
                            user.id,
                            tank.id
                        );
                        break;
                    case 6:
                        this.suicideAndEndTanks(
                            tank.gunnerId,
                            user.id,
                            null,
                            tank.id
                        );
                        break;
                    case 7:
                        this.suicideAndEndTanks(
                            tank.driverId,
                            user.id,
                            null,
                            tank.id
                        );
                        break;
                }
                this.updateLobbyToAll();
            } else {
                user.suicide();
                this.updateLobbyToAll();
            }
            socket.emit(SOCKETS.SUICIDE, this.answer.good(true));
            return;
        } else socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }
}

module.exports = LobbyManager;
