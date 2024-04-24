import { ERank } from "../modules/Server/interfaces";

export const getRankName = (rankName: ERank | null = null) => {
    switch (rankName) {
        case ERank.General: {
            return "Генерал";
        }
        case ERank.Officer: {
            return "Офицер";
        }
        case ERank.Private: {
            return "Рядовой";
        }
        case ERank.Sergeant: {
            return "Сержант";
        }
        default: {
            return "";
        }
    }
};
