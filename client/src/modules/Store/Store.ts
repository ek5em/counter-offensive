import { EHash, IUserInfo } from "../Server/interfaces";

interface IHash {
    lobby: string | null;
    chat: string | null;
    bullets: string | null;
    gamers: string | null;
    mobs: string | null;
    map: string | null;
    bodies: string | null;
}

export default class Store {
    hash: IHash;
    token: string | null;
    user: IUserInfo | null;

    constructor() {
        this.hash = {
            bullets: null,
            chat: null,
            gamers: null,
            lobby: null,
            mobs: null,
            map: null,
            bodies: null,
        };
        this.user = null;
        this.token = null /* this.getCookie().token */;
    }

    setUser(user: IUserInfo) {
        this.user = user;
        this.token = user.token;
    }

    getCookie(): { [key: string]: string } {
        const cookie: { [key: string]: string } = {};
        document.cookie.split(";").forEach((c) => {
            const [key, value] = c.split("=");
            if (key && value) {
                cookie[key.trim()] = value.trim();
            }
        });
        return cookie;
    }

    getHash(type: EHash): string | null {
        return this.hash[type];
    }

    getToken(): string | null {
        return this.token;
    }

    setHash(type: EHash, hash: string | null) {
        this.hash[type] = hash;
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            document.cookie = `token=${token}; path=/;`;
        } else {
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    }

    clearHash() {
        this.hash = {
            bullets: null,
            chat: null,
            gamers: null,
            lobby: null,
            map: null,
            mobs: null,
            bodies: null,
        };
    }
}
