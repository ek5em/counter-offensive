import {
    EGamerRole,
    ERank,
    IGamerInfo,
    ILobby,
    IMessage,
    IUserUnit,
} from "./interfaces";

interface IMock {
    users: (IGamerInfo & { password: string })[];
    messages: {
        text: string;
        rank_name: ERank;
        userId: number;
        nickname: string;
    }[];
    lobby: ILobby;
    unit: IUserUnit;
}

export const MOCK: IMock = {
    users: [
        {
            gamer_exp: 9999,
            id: 0,
            is_alive: null,
            level: 10,
            login: "123",
            next_rank: 65421,
            nickname: "Гришка",
            password: "123",
            rank_name: ERank.General,
            token: "123",
        },
        {
            gamer_exp: 9999,
            id: 1,
            is_alive: null,
            level: 10,
            login: "321",
            next_rank: 65421,
            nickname: "Петька заводной",
            password: "321",
            rank_name: ERank.General,
            token: "321",
        },
    ],
    messages: [
        {
            nickname: "Гришка",
            rank_name: ERank.General,
            text: "Привет, парни!",
            userId: 0,
        },
        {
            nickname: "Петька заводной",
            rank_name: ERank.General,
            text: "Привет, Гришка, ну чо как вчера жёско зарубимся в контр-нахрюк???!",
            userId: 1,
        },
    ],
    lobby: {
        bannerman: true,
        general: true,
        tanks: {
            heavyTank: [
                { id: 1, Commander: true, Gunner: false, Mechanic: false },
                { id: 3, Commander: false, Gunner: true, Mechanic: false },
            ],
            middleTank: [{ id: 2, Gunner: true, Mechanic: false }],
        },
    },
    unit: {
        angle: 0,
        personId: EGamerRole.infantry,
        speed: 1,
        x: 5,
        y: 5,
    },
};
