import Mediator, { TEVENTS } from "../Mediator/Mediator";
import { IGamerInfo, ILobby } from "../Server/interfaces";

export default class Store {
    token: string | null;
    user: IGamerInfo | null;
    lobby: ILobby | null;
    unit: null;
    mediator: Mediator;
    events: TEVENTS;

    constructor(mediator: Mediator) {
        this.user = null;
        this.lobby = null;
        this.unit = null;
        this.token = this.getCookie().token;
        this.mediator = mediator;
        this.events = mediator.getEventTypes();

        const { LOBBY, TOKEN, USER } = mediator.getTriggerTypes();

        mediator.set(LOBBY, () => this.getLobby());
        mediator.set(TOKEN, () => this.getToken());
        mediator.set(USER, () => this.getUser());
    }

    setUser(user: IGamerInfo) {
        this.user = user;
        this.mediator.call(this.events.UPDATE_USER, this.user);
    }

    getUser() {
        return this.user;
    }

    setLobby(lobby: ILobby) {
        this.lobby = lobby;
    }

    getLobby(): ILobby {
        return this.lobby
            ? this.lobby
            : {
                  bannerman: true,
                  general: true,
                  tanks: {
                      heavyTank: [],
                      middleTank: [],
                  },
              };
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

    getToken(): string | null {
        return this.token;
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            const expirationDate = new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ); // 30 дней
            document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;
            this.mediator.call(this.events.LOGIN, this.token);
        } else {
            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            this.mediator.call(this.events.LOGOUT, this.token);
        }
    }
}
