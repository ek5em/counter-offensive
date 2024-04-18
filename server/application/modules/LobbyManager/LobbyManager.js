const BaseModule = require("../BaseModule/BaseModule");
const { SOCKETS } = require("../../../config.js");

class LobbyManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);

        this.lobbyState = {
            bannerman: true,
        };
        this.crypto = require("crypto");
        this.uuid = require("uuid");

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

    tankRoleField(roleId) {
        if (roleId === 3 || roleId === 7) return "gunner_id";
        else if (roleId === 4 || roleId === 6) return "driver_id";
        else if (roleId === 5) return "commander_id";
    }

    async checkRoleAvailability(userId) {
        this.lobbyState = {
            bannerman: true,
        };
        let lobby = await this.db.getLobby();
        for (let role of lobby) {
            if (role.person_id === 2) {
                this.lobbyState.bannerman = false;
                break;
            }
        }
    }

    async addTank(tank) {
        await this.db.deleteTank(tank.id);
        if (tank.type === 1)
            await this.db.addMiddleTank(tank.driver_id, tank.gunner_id, 250);
        else
            await this.db.addHeavyTank(
                tank.driver_id,
                tank.gunner_id,
                tank.commander_id,
                400
            );
    }

    async checkTank(tankId) {
        const tank = (await this.db.getTankInLobbyById(tankId))[0];
        if (
            (tank.type === 1 && tank.gunner_id && tank.driver_id) ||
            (tank.type === 0 &&
                tank.gunner_id &&
                tank.driver_id &&
                tank.commander_id)
        ) {
            this.addTank(tank);
        }
    }

    async addGamer(userId, roleId) {
        await this.db.deleteGamerInTankLobby(userId);
        if (!(await this.db.checkLiveGamer().status_exists))
            await this.db.setStartGameTimestamp();
        await this.db.setGamerRole(userId, roleId, 8);
    }

    async setTankRoleHandler(userId, roleId, tankId) {
        let gamerRank = await this.db.getRankById(userId);
        let minPersonLevel = await this.db.getMinPersonLevelById(roleId);

        // Проверка доступности роли
        if (gamerRank[0].level < minPersonLevel[0].level) return 234;

        let tank = [];

        // Проверка наличия танкайди
        if (tankId){
            tank = (await this.db.getTankInLobbyById(tankId));
        }

        if (!tank.length) {
            this.addGamer(userId, roleId);
            let tankType = [3, 4, 5].includes(roleId) ? 0 : 1;
            let tankRoleField = this.tankRoleField(roleId);
            await this.db.createNewTankInLobby(userId, tankRoleField, tankType);
            return true;
        }

        let is_free = false;
        switch (roleId) {
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
        if (!is_free) return 238;

        this.addGamer(userId, roleId);
        let tankRoleField = this.tankRoleField(roleId);
        await this.db.setGamerInTankLobby(userId, tankRoleField, tankId);
        await this.checkTank(tankId);
        return true;
    }

    async setBannerman(userId) {
        let roleId = 2;

        // Данные для проверки доступности роли
        let nowPerson = await this.db.getPerson(roleId);

        // Проверка доступности роли
        if (nowPerson[0] !== undefined) return 237;

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
        if (gamerRank[0].level < minPersonLevel[0].level) return 234;

        if (
            nowPerson.length !== 0 &&
            gamerRank[0].gamer_exp < nowPerson[0].experience
        )
            return 235;

        // Подготовка к установке роли
        await this.db.deleteRole(1);
        this.addGamer(userId, roleId);
    }

    async setFootRoleHandler(userId, roleId) {
        // Установка пехотина(РПГшника)
        if ([8, 9].includes(roleId)) {
            this.addGamer(userId, roleId);
            return true;
        } else if ([1, 2].includes(roleId)) {
            if (roleId === 1) {
                return this.setGeneral(userId);
            } else if (roleId === 2) {
                return this.setBannerman(userId);
            }
        }
    }

    async setGamerRole({ token, role, tankId }, socket) {
        
        const { GET_USER } = this.Mediator.getTriggerTypes();
        const user = (await this.Mediator.get(GET_USER, token))[0];

        if (user && user.token) {
            if ([1, 2, 8, 9].includes(role)) {
                const setRole = await this.setFootRoleHandler(user.id, role);
                if (Number.isInteger(setRole)) {
                    socket.emit(SOCKETS.ERROR, this.answer.bad(setRole));
                } else
                    socket.emit(
                        SOCKETS.SET_GAMER_ROLE,
                        this.answer.good(setRole)
                    );
                this.updateLobbyToAll();
            } else if ([3, 4, 5, 6, 7].includes(role)) {
                const setRole = await this.setTankRoleHandler(
                    user.id,
                    role,
                    tankId
                );
                if (Number.isInteger(setRole))
                    socket.emit(SOCKETS.ERROR, this.answer.bad(setRole));
                else {
                    const tank = (
                        await this.db.getTankInLobbyByUserId(user.id)
                    )[0];
                    socket.emit(
                        SOCKETS.SET_GAMER_ROLE,
                        this.answer.good({ tankId: tank.id, tankType: tank.type })
                    );
                }
                this.updateLobbyToAll();
            } else socket.emit(SOCKETS.ERROR, this.answer.bad(463));
        } else socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }

    async getGamer(userId) {
        let gamer = await this.db.getGamerById(userId);
        if (gamer[0].person_id != -1) {
            let person = await this.db.getPersonParamsById(gamer[0].person_id);
            if ([3, 4, 5, 6, 7].includes(gamer[0].person_id)) {
                let tank = await this.db.getTankByUserId(userId);
                if (tank[0]) {
                    return {
                        personId: gamer[0].person_id,
                        x: tank[0].x,
                        y: tank[0].y,
                        angle: tank[0].angle,
                        towerAngle: tank[0].tower_angle,
                        speed: person[0].movementSpeed,
                        commanderAngle: tank[0].commander_angle,
                    };
                } else return false;
            }
            return {
                personId: gamer[0].person_id,
                x: gamer[0].x,
                y: gamer[0].y,
                speed: person[0].movementSpeed,
                angle: gamer[0].angle,
            };
        } else return false;
    }

    async getTanks() {
        let heavyTank = [];
        let middleTank = [];
        heavyTank = await this.db.getHeavyTank();
        heavyTank = heavyTank.map((obj) => {
            return {
                ...obj,
                Mechanic: obj.Mechanic === "true",
                Gunner: obj.Gunner === "true",
                Commander: obj.Commander === "true",
            };
        });

        middleTank = await this.db.getMiddleTank();
        middleTank = middleTank.map((obj) => {
            return {
                ...obj,
                Mechanic: obj.Mechanic === "true",
                Gunner: obj.Gunner === "true",
            };
        });

        return { heavyTank: heavyTank, middleTank: middleTank };
    }

    async getUserInfo({ token }, socket) {
        const { GET_USER } = this.Mediator.getTriggerTypes();
        const user = (await this.Mediator.get(GET_USER, token))[0];
        if (user && user.token) {
            const rank = (await this.db.getRankById(user.id))[0];
            const result = {
                id: user.id,
                token: token,
                login: user.login,
                nickname: user.nickname,
                rank_name: rank.rank_name,
                gamer_exp: rank.gamer_exp,
                next_rank: rank.next_rang,
                level: rank.level,
            };
            result.is_alive = await this.getGamer(user.id);
            socket.emit(SOCKETS.GET_USER_INFO, this.answer.good(result));
        } else socket.emit(SOCKETS.ERROR, this.anser.bad(401));
    }

    async getLobbyInfo() {
        await this.db.deleteEmptyTank();
        await this.checkRoleAvailability();
        const tanks = await this.getTanks();
        this.lobbyState.tanks = tanks;
    }

    async updateLobbyToAll() {
        await this.getLobbyInfo();
        this.io.emit(SOCKETS.GET_LOBBY, this.answer.good(this.lobbyState));
        return ;
    }

    async getLobby({ token }, socket) {
        const { GET_USER } = this.Mediator.getTriggerTypes();
        const user = (await this.Mediator.get(GET_USER, token))[0];
        if (user && user.token) {
            this.getLobbyInfo();
            socket.emit(SOCKETS.GET_LOBBY, this.answer.good(this.lobbyState));
            return;
        } else socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }

    async suicideAndEndTanks(target1Id, target2Id, userId, tankId) {
        await this.db.suicide(target1Id);
        if (target2Id) await this.db.suicide(target2Id);
        if (userId) await this.db.suicide(userId);
        await this.db.endTankGame(tankId);
    }

    async suicide({ userId }, socket) {
        const { GET_USER } = this.Mediator.getTriggerTypes();
        const user = (await this.Mediator.get(GET_USER, token))[0];
        if (user && user.token) {
            let gamer = await this.db.getGamerById(userId);
            let tank = await this.db.getTankByUserId(userId);
            if (tank[0]) {
                switch (gamer[0].person_id) {
                    case 3:
                        this.suicideAndEndTanks(
                            tank[0].commander_id,
                            userId,
                            tank[0].driver_id,
                            tank[0].id
                        );
                        break;
                    case 4:
                        this.suicideAndEndTanks(
                            tank[0].commander_id,
                            tank[0].gunner_id,
                            userId,
                            tank[0].id
                        );
                        break;
                    case 5:
                        this.suicideAndEndTanks(
                            tank[0].driver_id,
                            tank[0].gunner_id,
                            userId,
                            tank[0].id
                        );
                        break;
                    case 6:
                        this.suicideAndEndTanks(
                            tank[0].gunner_id,
                            userId,
                            null,
                            tank[0].id
                        );
                        break;
                    case 7:
                        this.suicideAndEndTanks(
                            tank[0].driver_id,
                            userId,
                            null,
                            tank[0].id
                        );
                        break;
                }
                this.updateLobbyToAll();
            } else {
                await this.db.suicide(userId);
                this.updateLobbyToAll();
            }
            const hashLobby = this.crypto
                .createHash("sha256")
                .update(this.uuid.v4())
                .digest("hex");
            await this.db.updateLobbyHash(hashLobby);
            socket.emit(SOCKETS.SUICIDE, this.answer.good(true));
            return;
        } else socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }
}

module.exports = LobbyManager;
