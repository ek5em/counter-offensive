import { SHA256 } from "crypto-js";
import { io, Socket } from "socket.io-client";
import Mediator, { TEVENTS } from "../Mediator/Mediator";
import Store from "../Store/Store";
import {
    IGamerInfo,
    IError,
    EGamerRole,
    IToken,
    IAnswer,
    ILobby,
    ETank,
    IMessage,
    ERank,
    IMap,
} from "./interfaces";
import { ESOCKET } from "../../config";
import { MOCK } from "./mock";

export default class Server {
    mediator: Mediator;
    HOST: string;
    STORE: Store;
    socket: Socket | null;
    useMock: boolean;
    events: TEVENTS;
    triggers: TEVENTS;

    constructor(HOST: string, mediator: Mediator, useMock: boolean) {
        this.HOST = HOST;
        this.mediator = mediator;
        this.STORE = new Store(mediator);
        this.events = mediator.getEventTypes();
        this.triggers = mediator.getTriggerTypes();
        this.useMock = useMock;

        this.socket = this.useMock ? null : io(HOST);
        if (!this.useMock && this.socket) {
            this.socket.on(ESOCKET.ERROR, (answer: IError) => {
                mediator.call(this.events.SERVER_ERROR, answer.error);
            });

            this.socket.on(
                ESOCKET.GET_MESSAGE,
                (answer: IAnswer<IMessage[]>) => {
                    mediator.call(this.events.NEW_MESSAGE, [...answer.data]);
                }
            );

            this.socket.on(ESOCKET.SEND_MESSAGE, (answer: IAnswer<true>) => {
                mediator.call(this.events.SEND_MESSAGE_STATUS, answer.data);
            });

            this.socket.on(ESOCKET.REGISTRATION, (answer: IAnswer<IToken>) => {
                this.STORE.setToken(answer.data.token);
            });

            this.socket.on(ESOCKET.LOGIN, (answer: IAnswer<IToken>) => {
                this.STORE.setToken(answer.data.token);
            });

            this.socket.on(
                ESOCKET.GET_USER_INFO,
                (answer: IAnswer<IGamerInfo>) => {
                    this.STORE.setUser(answer.data);
                }
            );

            this.socket.on(ESOCKET.LOGOUT, () => {
                this.STORE.setToken(null);
            });

            this.socket.on(
                ESOCKET.TOKEN_VERIFICATION,
                (answer: IAnswer<IToken>) => {
                    this.STORE.setToken(answer.data.token);
                }
            );

            this.socket.on(
                ESOCKET.SET_GAMER_ROLE,
                (answer: IAnswer<{ tankId: number; tankType: ETank }>) => {
                    if (answer.data.tankId) {
                        mediator.call(this.events.GO_TO_TANK, answer.data);
                    } else {
                        this.getUser();
                    }
                }
            );

            this.socket.on(ESOCKET.GET_LOBBY, (answer: IAnswer<ILobby>) => {
                this.STORE.setLobby(answer.data);
            });

            this.socket.on(ESOCKET.GAME_MAP, (answer: IAnswer<IMap>) => {
                mediator.call(this.events.UPDATE_MAP, answer.data);
            });

            this.socket.on(ESOCKET.GAME_ENTITIES, (answer) => {
                mediator.call(this.events.UPDATE_ENTITIES, answer.data);
            });

            this.socket.on(ESOCKET.MOTION, () => {
                mediator.call(this.events.MOVE_UNIT, true);
            });
        }
    }

    // АВТОРИЗАЦИЯ

    registration(login: string, nickname: string, password: string) {
        if (this.useMock) {
            const user = MOCK.users.find((el) => el.login === login);
            if (user) {
                this.mediator.call(this.events.SERVER_ERROR, {
                    code: 460,
                    text: "Логин занят",
                });
            } else {
                const newUser = {
                    gamer_exp: 0,
                    id: MOCK.users.length,
                    is_alive: null,
                    level: 1,
                    login,
                    next_rank: 144,
                    nickname,
                    password,
                    rank_name: ERank.Private,
                    token: `${Math.random()}`,
                };
                MOCK.users.push(newUser);
                this.STORE.setToken(newUser.token);
            }
        } else {
            const hash = SHA256(login + password).toString();
            this.socket?.emit(ESOCKET.REGISTRATION, { login, nickname, hash });
        }
    }

    login(login: string, password: string) {
        if (this.useMock) {
            const user = MOCK.users.find((u) => u.login === login);
            if (user) {
                this.STORE.setToken(user.token);
            } else {
                this.mediator.call(this.events.SERVER_ERROR, {
                    code: 403,
                    text: "Неверный логин или пароль",
                });
            }
        } else {
            const rnd = Math.random();
            const hash = SHA256(
                SHA256(login + password).toString() + rnd
            ).toString();
            this.socket?.emit(ESOCKET.LOGIN, { login, hash, rnd });
        }
    }

    tokenVerification() {
        if (this.useMock) {
            this.mediator.call(this.events.SERVER_ERROR, {
                code: 401,
                text: "Ошибка аунтификации",
            });
        } else {
            this.socket?.emit(ESOCKET.TOKEN_VERIFICATION, {
                token: this.STORE.getCookie().token,
            });
        }
    }

    getUser() {
        if (this.useMock) {
            const user = MOCK.users.find(
                (u) => u.token === this.STORE.getToken()
            );
            if (user) {
                this.STORE.setUser(user);
            } else {
                this.mediator.call(this.events.SERVER_ERROR, {
                    code: 401,
                    text: "Ошибка аунтификации",
                });
            }
        } else {
            this.socket?.emit(ESOCKET.GET_USER_INFO, {
                token: this.STORE.getToken(),
            });
        }
    }

    logout() {
        if (this.useMock) {
            this.STORE.setToken(null);
        } else {
            this.socket?.emit(ESOCKET.LOGOUT, {
                token: this.STORE.getToken(),
            });
        }
    }

    // ЛОББИ

    sendMessage(message: string) {
        if (this.useMock) {
            const user = MOCK.users.find(
                (u) => u.token === this.STORE.getToken()
            );
            if (user) {
                MOCK.messages.push({
                    nickname: user.nickname,
                    rank_name: user.rank_name,
                    text: message,
                    userId: user.id,
                });
                this.mediator.call(this.events.NEW_MESSAGE, [...MOCK.messages]);
                this.mediator.call(this.events.SEND_MESSAGE_STATUS, true);
            }
        } else {
            this.socket?.emit(ESOCKET.SEND_MESSAGE, {
                token: this.STORE.getToken(),
                message,
            });
        }
    }

    getMessages() {
        if (this.useMock) {
            this.mediator.call(this.events.NEW_MESSAGE, [...MOCK.messages]);
        } else {
            this.socket?.emit(ESOCKET.GET_MESSAGE, {
                token: this.STORE.getToken(),
            });
        }
    }

    setGamerRole(role: EGamerRole, tankId: number | null = null) {
        if (this.useMock) {
            const user = MOCK.users.find(
                (u) => u.token === this.STORE.getToken()
            );
            if (user) {
                switch (role) {
                    case EGamerRole.bannerman: {
                        if (this.STORE.user) {
                            this.STORE.user.is_alive = MOCK.unit;
                            this.STORE.user.is_alive.personId =
                                EGamerRole.bannerman;
                        }
                        break;
                    }
                    case EGamerRole.general: {
                        if (user.level < 16) {
                            this.mediator.call(this.events.SERVER_ERROR, {
                                code: 234,
                            });
                        } else {
                            if (this.STORE.user) {
                                this.STORE.user.is_alive = MOCK.unit;
                                this.STORE.user.is_alive.personId =
                                    EGamerRole.general;
                            }
                        }
                        break;
                    }
                    case EGamerRole.heavyTankCommander: {
                        break;
                    }
                    case EGamerRole.heavyTankGunner: {
                        break;
                    }
                    case EGamerRole.heavyTankMeh: {
                        break;
                    }
                    case EGamerRole.infantry: {
                        if (this.STORE.user) {
                            this.STORE.user.is_alive = MOCK.unit;
                            this.STORE.user.is_alive.personId =
                                EGamerRole.infantry;
                        }
                        break;
                    }
                    case EGamerRole.infantryRPG: {
                        if (this.STORE.user) {
                            this.STORE.user.is_alive = MOCK.unit;
                            this.STORE.user.is_alive.personId =
                                EGamerRole.infantryRPG;
                        }
                        break;
                    }
                    case EGamerRole.middleTankGunner: {
                        break;
                    }
                    case EGamerRole.middleTankMeh: {
                        break;
                    }
                }
                this.mediator.call(this.events.LOBBY_UPDATE, true);
                this.mediator.call(
                    this.events.UPDATE_USER,
                    this.STORE.getUser()
                );
            }
        } else {
            this.socket?.emit(ESOCKET.SET_GAMER_ROLE, {
                token: this.STORE.getToken(),
                role,
                tankId,
            });
        }
    }

    getLobby() {
        if (this.useMock) {
            this.STORE.setLobby(MOCK.lobby);
        } else {
            this.socket?.emit(ESOCKET.GET_LOBBY, {
                token: this.STORE.getToken(),
            });
        }
    }

    // ИГРА

    getMap() {
        if (this.useMock) {
        } else {
            this.socket?.emit(ESOCKET.GAME_MAP, {
                token: this.STORE.getToken(),
            });
        }
    }

    getEntities() {
        if (this.useMock) {
        } else {
            this.socket?.emit(ESOCKET.GAME_ENTITIES, {
                token: this.STORE.getToken(),
            });
        }
    }

    suicide() {
        if (this.useMock) {
        } else {
            this.socket?.emit(ESOCKET.SUICIDE, {
                token: this.STORE.getToken(),
            });
        }
    }

    unitMotion(x: number | null, y: number | null, angle: number) {
        if (this.useMock) {
        } else {
            this.socket?.emit(ESOCKET.MOTION, {
                token: this.STORE.getToken(),
                x,
                y,
                angle,
            });
        }
    }

    makeShot(x: number, y: number, angle: number) {
        if (this.useMock) {
        } else {
            this.socket?.emit(ESOCKET.FIRE, {
                token: this.STORE.getToken(),
                x,
                y,
                angle,
            });
        }
    }
}
