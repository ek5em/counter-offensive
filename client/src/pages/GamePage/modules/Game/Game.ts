import { requestDelay, staticMap } from "../../../../config";
import { Mediator, Server } from "../../../../modules";
import {
    EMapObject,
    IBody,
    IBullet,
    IGamer,
    IMapObject,
    IMob,
    ITank,
    IUserUnit,
} from "../../../../modules/Server/interfaces";

export interface IGameScene {
    tanks: ITank[];
    bullets: IBullet[];
    mobs: IMob[];
    gamers: IGamer[];
    bodies: IBody[];
    map: IMapObject[];
}

interface IGame {
    server: Server;
    mediator: Mediator;
    cbs: {
        roundEnd: () => void;
    };
}

export default class Game {
    serverUnit: IUserUnit | null;
    server: Server;
    mediator: Mediator;
    scene: IGameScene;
    interval: NodeJS.Timer;
    roundEnd: () => void;

    constructor({ server, mediator, cbs }: IGame) {
        this.server = server;
        this.mediator = mediator;
        this.roundEnd = cbs.roundEnd;
        this.serverUnit = { personId: 1, x: 0, y: 0, angle: 0, speed: 0 };
        this.scene = {
            bullets: [],
            mobs: [],
            gamers: [],
            tanks: [],
            bodies: [],
            map: [],
        };
        const { THROW_TO_LOBBY, UPDATE_SCENE, UPDATE_TIME } =
            mediator.getTriggerTypes();
        let isDead = false,
            isEnd = false;
        this.interval = setInterval(async () => {
            const res = await server.getScene();
            if (res) {
                const {
                    gametime,
                    is_dead,
                    is_end,
                    gamer,
                    bullets,
                    gamers,
                    mobs,
                    bodies,
                    tanks,
                    map,
                } = res;
                if (is_end && !isEnd) {
                    isEnd = true;
                    this.serverUnit = null;
                    return mediator.get(THROW_TO_LOBBY, "victory");
                }
                mediator.get(UPDATE_TIME, gametime);
                this.serverUnit = gamer;
                if (is_dead && !isDead) {
                    isDead = true;
                    mediator.get(THROW_TO_LOBBY, "defeat");
                }
                if (gamers) {
                    this.scene.gamers = gamers;
                }
                if (mobs) {
                    this.scene.mobs = mobs;
                }
                if (bullets) {
                    this.scene.bullets = bullets;
                }
                if (bodies) {
                    this.scene.bodies = bodies;
                }
                if (tanks) {
                    this.scene.tanks = tanks;
                }
                if (map) {
                    this.scene.map = [];
                    this.scene.map.push({
                        type: EMapObject.base,
                        ...res.mobBase,
                        angle: 0,
                        isVert: false,
                        r: 0,
                        sizeX: 0,
                        sizeY: 0,
                    });
                    staticMap.crossyRoad.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.crossyRoad,
                            ...el,
                            r: 0,
                            isVert: false,
                        });
                    });
                    staticMap.crossyRoadTurnCont.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.crossyRoadTurnCont,
                            ...el,
                            r: 0,
                            sizeX: 2,
                            sizeY: 2,
                            isVert: false,
                        });
                    });
                    staticMap.crossyRoadTurn.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.crossyRoadTurn,
                            ...el,
                            r: 0,
                            sizeX: 2,
                            sizeY: 2,
                            isVert: false,
                        });
                    });
                    staticMap.crossyRoadEnd.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.crossyRoadEnd,
                            ...el,
                            r: 0,
                            sizeX: 2,
                            sizeY: 2,
                            isVert: false,
                        });
                    });
                    staticMap.bushes.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.bush,
                            ...el,
                            r: 0.5,
                            angle: 0,
                            isVert: false,
                            sizeX: 2,
                            sizeY: 2,
                        });
                    });
                    staticMap.trees.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.tree,
                            ...el,
                            r: 1.5,
                            angle: 0,
                            isVert: false,
                            sizeX: 3,
                            sizeY: 3,
                        });
                    });
                    staticMap.road.forEach((el) => {
                        this.scene.map.push({
                            type: EMapObject.road,
                            ...el,
                            r: 0,
                            angle: 0,
                            isVert: false,
                        });
                    });

                    this.scene.map = this.scene.map.concat(
                        map.map((obj) => {
                            const { x, y, sizeX, sizeY, angle } = obj;
                            const isVert = sizeY > sizeX;
                            switch (obj.type) {
                                case EMapObject.fence:
                                case EMapObject.house:
                                case EMapObject.sand: {
                                    return {
                                        ...obj,
                                        y: y + sizeY,
                                        angle: (angle * Math.PI) / 180,
                                        isVert,
                                    };
                                }
                                case EMapObject.stone:
                                case EMapObject.bush:
                                case EMapObject.stump:
                                case EMapObject.trusovMoment: {
                                    return {
                                        ...obj,
                                        x: x + sizeX / 2,
                                        y: y + sizeY / 2,
                                    };
                                }
                                case EMapObject.box:
                                case EMapObject.spike:
                                case EMapObject.road: {
                                    return { ...obj, y: y + sizeY };
                                }
                                case EMapObject.crossyRoad:
                                case EMapObject.crossyRoadEnd:
                                case EMapObject.crossyRoadTurn:
                                case EMapObject.crossyRoadTurnCont:
                                case EMapObject.fenceTurn: {
                                    return {
                                        ...obj,
                                        y: y + sizeY,
                                        angle: (angle * Math.PI) / 180,
                                    };
                                }
                                default: {
                                    return { ...obj };
                                }
                            }
                        })
                    );
                    mediator.get(UPDATE_SCENE, this.scene.map);
                }
            }
        }, requestDelay.game);
    }

    getScene() {
        return this.scene;
    }
}
