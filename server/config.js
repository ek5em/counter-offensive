exports.SOCKETS = {
    SEND_MESSAGE: "SEND_MESSAGE",
    GET_MESSAGE: "GET_MESSAGE",
    REGISTRATION: "REGISTRATION",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    UPDATE_PASSWORD: "UPDATE_PASSWORD",
    SET_GAMER_ROLE: "SET_GAMER_ROLE",
    GET_LOBBY: "GET_LOBBY",
    SUICIDE: "SUICIDE",
    GET_USER_INFO: "GET_USER_INFO",
    MOTION: "MOTION",
    FIRE: "FIRE",
    TOKEN_VERIFICATION: "TOKEN_VERIFICATION",
    GAME_MAP: "GAME_MAP",
    GAME_ENTITIES: "GAME_ENTITIES",
    ERROR: "ERROR",
};

exports.MEDIATOR = {
    TRIGGERS: {
        GET_USER: "GET_USER",
        ALL_USERS: "ALL_USERS",
        GAME_TANKS: "GAME_TANKS",
        START_GAME: "START_GAME",
    },
};

exports.updateSceneTimestamp = 16;

exports.gamerRoles = {
    general: 1,
    bannerman: 2,
    heavyTankGunner: 3,
    heavyTankMeh: 4,
    heavyTankCommander: 5,
    middleTankMeh: 6,
    middleTankGunner: 7,
    infantry: 8,
    infantryRPG: 9,
};

exports.heavyTankRoles = [
    this.gamerRoles.heavyTankCommander,
    this.gamerRoles.heavyTankGunner,
    this.gamerRoles.heavyTankMeh,
];

exports.middleTankRoles = [
    this.gamerRoles.middleTankMeh,
    this.gamerRoles.middleTankGunner,
];

exports.tankRoles = [...this.heavyTankRoles, ...this.middleTankRoles];

exports.footRoles = [
    this.gamerRoles.general,
    this.gamerRoles.bannerman,
    this.gamerRoles.infantry,
    this.gamerRoles.infantryRPG,
];

exports.objectDict = {
    house: 1,
    stone: 2,
    spike: 5,
    stump: 6,
    sand: 14,
};

exports.dynamicObjects = [
    this.objectDict.house,
    this.objectDict.stone,
    this.objectDict.spike,
    this.objectDict.stump,
    this.objectDict.sand,
];

exports.staticObjects = [];

exports.bulletDict = {
    gunBullet: 0,
    RPGBullet: 1
};
