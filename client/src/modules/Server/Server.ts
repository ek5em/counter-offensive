import { SHA256 } from "crypto-js";
import { io, Socket } from "socket.io-client";
import Mediator from "../Mediator/Mediator";
import Store from "../Store/Store";
import {
    IGamerInfo,
    IError,
    EGamerRole,
    IScene,
    IToken,
    IAnswer,
    ILobby,
    ETank,
    IMessage,
} from "./interfaces";
import { ESOCKET } from "../../config";

export default class Server {
    mediator: Mediator;
    HOST: string;
    STORE: Store;
    socket: Socket;

    constructor(HOST: string, mediator: Mediator) {
        this.HOST = HOST;
        this.mediator = mediator;
        this.STORE = new Store();

        this.socket = io(HOST);

        const { NEW_MESSAGE, LOGIN, SEND_MESSAGE_STATUS, LOGOUT } =
            mediator.getTriggerTypes();

        const { SERVER_ERROR, GO_TO_TANK, UPDATE_USER, LOBBY_UPDATE } =
            this.mediator.getEventTypes();

        this.socket.on(ESOCKET.ERROR, (answer: IError) => {
            mediator.call(SERVER_ERROR, answer.error);
        });

        this.socket.on(ESOCKET.GET_MESSAGE, (answer: IAnswer<IMessage[]>) => {
            mediator.get(NEW_MESSAGE, answer.data);
        });

        this.socket.on(ESOCKET.SEND_MESSAGE, (answer: IAnswer<true>) => {
            mediator.get(SEND_MESSAGE_STATUS, answer.data);
        });

        this.socket.on(ESOCKET.REGISTRATION, (answer: IAnswer<IToken>) => {
            mediator.get(LOGIN, answer.data);
        });

        this.socket.on(ESOCKET.LOGIN, (answer: IAnswer<IToken>) => {
            mediator.get(LOGIN, answer.data);
        });

        this.socket.on(ESOCKET.GET_USER_INFO, (answer: IAnswer<IGamerInfo>) => {
            this.STORE.setUser(answer.data);
            mediator.call(UPDATE_USER, answer.data);
        });

        this.socket.on(ESOCKET.LOGOUT, () => {
            mediator.get(LOGOUT);
        });

        this.socket.on(ESOCKET.TOKEN_VERIFICATION, () => {
            mediator.get(LOGIN, { token: this.STORE.getToken() });
        });

        this.socket.on(
            ESOCKET.SET_GAMER_ROLE,
            (answer: IAnswer<{ tankId: number; tankType: ETank }>) => {
                if (answer.data.tankId) {
                    mediator.call(GO_TO_TANK, answer.data);
                }
            }
        );

        this.socket.on(ESOCKET.GET_LOBBY, (answer: IAnswer<ILobby>) => {
            this.STORE.setLobby(answer.data);
            mediator.call(LOBBY_UPDATE, answer.data);
        });
    }

    async request<T>(method: string, params: any): Promise<T | null> {
        try {
            const str = Object.keys(params)
                .map(
                    (key) => `${key}=${params[key] === 0 ? 0.01 : params[key]}`
                )
                .join("&");
            const res = await fetch(
                `${this.HOST}/server/public/?method=${method}&${str}`
            );
            const answer = await res.json();

            if (answer.result === "ok") {
                return answer.data as T;
            }
            /*  this.mediator.call(SERVER_ERROR, answer.error); */
            return null;
        } catch (e) {
            /* this.mediator.call(SERVER_ERROR, {
                code: 9000,
                text: "Вообще всё плохо!",
            }); */
            return null;
        }
    }

    // АВТОРИЗАЦИЯ

    registration(login: string, nickname: string, password: string) {
        const hash = SHA256(login + password).toString();
        this.socket.emit(ESOCKET.REGISTRATION, { login, nickname, hash });
    }

    login(login: string, password: string) {
        const rnd = Math.random();
        const hash = SHA256(
            SHA256(login + password).toString() + rnd
        ).toString();
        this.socket.emit(ESOCKET.LOGIN, { login, hash, rnd });
    }

    tokenVerification() {

        this.socket.emit(ESOCKET.TOKEN_VERIFICATION, {
            token: this.STORE.getToken(),
        });
    }

    getUser() {
        this.socket.emit(ESOCKET.GET_USER_INFO, {
            token: this.STORE.getToken(),
        });
    }

    logout() {
        this.socket.emit(ESOCKET.LOGOUT, {
            token: this.STORE.getToken(),
        });
    }

    // ЛОББИ

    sendMessage(message: string) {
        this.socket.emit(ESOCKET.SEND_MESSAGE, {
            token: this.STORE.getToken(),
            message,
        });
    }

    getMessages() {
        this.socket.emit(ESOCKET.GET_MESSAGE, {
            token: this.STORE.getToken(),
        });
    }

    setGamerRole(role: EGamerRole, tankId: number | null = null) {
        this.socket.emit(ESOCKET.SET_GAMER_ROLE, {
            token: this.STORE.getToken(),
            role,
            tankId,
        });
    }

    getLobby() {
        this.socket.emit(ESOCKET.GET_LOBBY, {
            token: this.STORE.getToken(),
        });
    }

    // ИГРА

    getScene(): Promise<IScene | null> {
        return this.request("getScene", {
            token: this.STORE.getToken(),
        });
    }

    suicide(): Promise<true | null> {
        return this.request("suicide", {
            token: this.STORE.getToken(),
        });
    }

    unitMotion(
        x: number | null,
        y: number | null,
        angle: number
    ): Promise<true | null> {
        return this.request("motion", {
            token: this.STORE.getToken(),
            x,
            y,
            angle,
        });
    }

    makeShot(x: number, y: number, angle: number): Promise<true | null> {
        return this.request("fire", {
            token: this.STORE.getToken(),
            x,
            y,
            angle,
        });
    }
}
