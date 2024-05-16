import { ERank } from "../modules/Server/interfaces";
import { firstRank, fourthRank, secondRank, thirdRank } from "../assets/png";

export const getRankImg = (rank: ERank | null = null) => {
    switch (rank) {
        case ERank.Private: {
            return firstRank;
        }
        case ERank.Sergeant: {
            return secondRank;
        }
        case ERank.Officer: {
            return thirdRank;
        }
        case ERank.General: {
            return fourthRank;
        }
        default: {
            return firstRank;
        }
    }
};
