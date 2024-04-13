import { SHA256 } from "crypto-js";
import { io, Socket } from "socket.io-client";
import Mediator from "../Mediator/Mediator";
import Store from "../Store/Store";
import {
    IUserInfo,
    IError,
    IMessages,
    EGamerRole,
    ILobbyState,
    EHash,
    IScene,
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

        const { NEW_MESSAGE, LOGIN } = mediator.getTriggerTypes();

        this.socket.on(ESOCKET.GET_MESSAGES, (data: IMessages) => {
            mediator.get(NEW_MESSAGE, data);
        });

        this.socket.on(ESOCKET.LOGIN, (data: IUserInfo) => {
            mediator.get(LOGIN, data);
        });
    }

    async request<T>(method: string, params: any): Promise<T | null> {
        const { SERVER_ERROR } = this.mediator.getEventTypes();
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
            this.mediator.call<IError>(SERVER_ERROR, answer.error);
            return null;
        } catch (e) {
            this.mediator.call<IError>(SERVER_ERROR, {
                code: 9000,
                text: "Вообще всё плохо!",
            });
            return null;
        }
    }

    // АВТОРИЗАЦИЯ

    registration(
        login: string,
        nickname: string,
        password: string
    ): Promise<IUserInfo | null> {
        const hash = SHA256(login + password).toString();
        return this.request("registration", { login, nickname, hash });
    }

    /* registration(login: string, nickname: string, password: string) {
        const hash = SHA256(login + password).toString();
        this.socket.emit(ESOCKET.REGISTRATION, { login, nickname, hash });
    } */

    login(login: string, password: string): Promise<IUserInfo | null> {
        const rnd = Math.random();
        const hash = SHA256(
            SHA256(login + password).toString() + rnd
        ).toString();
        return this.request("login", { login, hash, rnd });
    }

    /* login(login: string, password: string) {
        const rnd = Math.random();
        const hash = SHA256(
            SHA256(login + password).toString() + rnd
        ).toString();
        this.socket.emit(ESOCKET.LOGIN, { login, hash, rnd });
    } */

    tokenVerification(token: string): Promise<IUserInfo | null> {
        return this.request("tokenVerification", { token });
    }

    logout(): Promise<true | null> {
        return this.request("logout", { token: this.STORE.getToken() });
    }

    updatePassword(login: string, newPassword: string): Promise<true | null> {
        const hash = SHA256(login + newPassword).toString();
        return this.request("updatePassword", {
            token: this.STORE.getToken(),
            hash,
        });
    }

    // ЛОББИ

    getMessages(): Promise<IMessages | true | null> {
        return this.request("getMessages", {
            token: this.STORE.getToken(),
            hash: this.STORE.getHash(EHash.chat),
        });
    }

    /* sendMessages(message: string) {
        this.socket.emit(ESOCET.SEND_MESSAGE, {
            token: this.STORE.getToken(),
            message,
        });
    } */

    sendMessage(message: string): Promise<true | null> {
        return this.request("sendMessage", {
            token: this.STORE.getToken(),
            message,
        });
    }

    setGamerRole(
        role: EGamerRole,
        tankId: number | null = null
    ): Promise<true | null> {
        return this.request("setGamerRole", {
            token: this.STORE.getToken(),
            role,
            tankId,
        });
    }

    getLobby(): Promise<ILobbyState | true | null> {
        return this.request("getLobby", {
            token: this.STORE.getToken(),
            hash: this.STORE.getHash(EHash.lobby),
        });
    }

    // ИГРА

    getScene(): Promise<IScene | null> {
        return this.request("getScene", {
            token: this.STORE.getToken(),
            hashMap: this.STORE.getHash(EHash.map),
            hashGamers: this.STORE.getHash(EHash.gamers),
            hashMobs: this.STORE.getHash(EHash.mobs),
            hashBullets: this.STORE.getHash(EHash.bullets),
            hashBodies: this.STORE.getHash(EHash.bodies),
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
