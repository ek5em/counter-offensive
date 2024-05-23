import {
    BaseUnit,
    Bannerman,
    General,
    TankCommander,
    MiddleCorpus,
    MiddleTower,
    HeavyCorpus,
    HeavyTower,
    Infantry,
    InfantryRPG,
} from "../modules";

export type TWIN = {
    left: number;
    bottom: number;
    width: number;
    height: number;
};

export type TPoint = {
    x: number;
    y: number;
};

export type TCircle = TPoint & {
    r: number;
};

/* export type TUnit =
    | Infantry
    | InfantryRPG
    | MiddleCorpus
    | MiddleTower
    | Bannerman
    | HeavyTower
    | HeavyCorpus
    | TankCommander
    | BaseUnit
    | General;
 */