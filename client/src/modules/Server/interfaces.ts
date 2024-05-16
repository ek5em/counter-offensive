export interface IError {
    code: number;
    text: string;
    id?: string;
}

export interface IMessage {
    nickname: string;
    text: string;
    level: number;
    rank_name: ERank;
    sendTime: string;
    userId: number;
}

export enum EResult {
    ok = "ok",
    error = "error",
}

export interface IAnswer<T> {
    result: EResult.ok;
    data: T;
}

export interface IError {
    result: EResult.error;
    error: {
        code: number;
        text: string;
    };
}

export interface IMiddleTank {
    id: number;
    Mechanic: boolean;
    Gunner: boolean;
}

export interface IHeavyTank extends IMiddleTank {
    Commander: boolean;
}

export interface ILobby {
    general: boolean;
    bannerman: boolean;
    tanks: {
        heavyTank: IHeavyTank[];
        middleTank: IMiddleTank[];
    };
}

export interface IToken {
    token: string;
}

export interface IGamerInfo {
    gamer_exp: number;
    id: number;
    is_alive: null | IUserUnit;
    level: number;
    login: string;
    next_rank: number;
    nickname: string;
    rank_name: ERank;
    token: string;
}

interface IPoint {
    x: number;
    y: number;
    angle: number;
}

export interface IUserUnit extends IPoint {
    personId: EGamerRole;
    speed: number;
}

export interface IBullet extends Omit<IPoint, "angle"> {
    type: EProjectile;
    dx: number;
    dy: number;
}

export interface IBody extends IPoint {
    type: EBody;
    isMob: boolean;
}

export interface IMob extends IPoint {
    person_id: EGamerRole.infantry | EGamerRole.infantryRPG;
}

export interface IGamer extends IPoint {
    person_id:
        | EGamerRole.general
        | EGamerRole.bannerman
        | EGamerRole.infantry
        | EGamerRole.infantryRPG;
}

export interface ITank extends IPoint {
    type: ETank;
    tower_angle: number;
}

export interface IMapObject extends IPoint {
    sizeX: number;
    sizeY: number;
}

export interface IDynamicMap {
    houses: IMapObject[];
    sands: IMapObject[];
    spikes: IMapObject[];
    stones: IMapObject[];
    stumps: IMapObject[];
}

export interface IStaticMap {
    bushes: any[];
    trees: any[];
    roads: any[];
    crossyRoads: any[];
    crossyRoadsTurnCont: any[];
    crossyRoadsTurn: any[];
    crossyRoadsEnd: any[];
    base: { x: number; y: number; radius: number };
}

export interface IMap {
    dynamic: IDynamicMap;
    static: IStaticMap;
}

export interface IScene {
    tanks: ITank[] | null;
    gamers: IGamer[] | null;
    mobs: IMob[] | null;
    bullets: IBullet[] | null;
    bodies: IBody[] | null;
    map: IMapObject[] | null;
    mobBase: IPoint & { radius: number };
    gamer: IUserUnit | null;
    is_dead: boolean;
    is_end: boolean;
    gametime: number;
}

export enum EGamerRole {
    general = 1,
    bannerman,
    heavyTankGunner,
    heavyTankMeh,
    heavyTankCommander,
    middleTankMeh,
    middleTankGunner,
    infantry,
    infantryRPG,
}

export enum ERank {
    Private = "Private",
    Sergeant = "Sergeant",
    Officer = "Officer",
    General = "General",
}

export enum ETank {
    heavy,
    middle,
}

export enum EMapObject {
    base,
    house,
    stone,
    fence,
    fenceTurn,
    spike,
    stump,
    road,
    crossyRoadEnd,
    crossyRoadTurnCont,
    crossyRoadTurn,
    crossyRoad,
    box,
    bush,
    sand,
    tree,
    trusovMoment,
}

export enum EBody {
    man,
    middleTank,
    heavyTank,
    middleTower,
    heavyTower,
}

export enum EProjectile {
    bullet,
    grenade,
}
