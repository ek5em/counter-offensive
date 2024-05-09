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
    ERROR: "ERROR",
    TOKEN_VERIFICATION: "TOKEN_VERIFICATION",
    GAME_MAP: "GAME_MAP",
    GAME_ENTITIES: "GAME_ENTITIES",
};

exports.MEDIATOR = {
    TRIGGERS: {
        GET_USER: "GET_USER",
        ALL_USERS: "ALL_USERS",
        GAME_TANKS: "GAME_TANKS",
    },
};

exports.updateSceneTimestamp = 16;

const gamerRoles = {
    general: 1,
    bannerman: 2,
    heavyTankGunner: 3,
    heavyTankMeh: 4,
    heavyTankCommander: 5,
    middleTankMeh: 6,
    middleTankGunner: 7,
    infantry: 9,
    infantryRPG: 9,
};

exports.gamerRoles;

exports.tankRoles = [
    gamerRoles.heavyTankCommander,
    gamerRoles.heavyTankGunner,
    gamerRoles.heavyTankMeh,
    gamerRoles.middleTankMeh,
    gamerRoles.middleTankGunner
];

exports.footRoles = [
    gamerRoles.general,
    gamerRoles.bannerman,
    gamerRoles.infantry,
    gamerRoles.infantryRPG,
]
