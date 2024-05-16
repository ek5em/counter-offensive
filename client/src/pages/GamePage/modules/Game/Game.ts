import { staticMap } from "../../../../config";
import { Mediator, Server } from "../../../../modules";
import {
    EGamerRole,
    IBody,
    IBullet,
    IGamer,
    IMap,
    IMapObject,
    IMob,
    IScene,
    ITank,
    IUserUnit,
} from "../../../../modules/Server/interfaces";
import { getUnit } from "../../components/GameCanvas/getUnit";
import { BaseUnit } from "./Units";

export interface IGameScene {
    tanks: ITank[];
    bullets: IBullet[];
    mobs: IMob[];
    gamers: IGamer[];
    bodies: IBody[];
    map: IMap;
}

export enum EKeys {
    Up = "Up",
    Down = "Down",
    Right = "Right",
    Left = "Left",
    Space = "Space",
}

export type TPressedKeys = {
    [key in EKeys]: boolean;
};

interface IGame {
    server: Server;
    mediator: Mediator;
}

export default class Game {
    user: IUserUnit | null;
    unit: BaseUnit;
    serverUnit: IUserUnit | null;
    server: Server;
    mediator: Mediator;
    scene: IGameScene;
    keyPressed: TPressedKeys;

    constructor({ server, mediator }: IGame) {
        this.server = server;
        this.mediator = mediator;
        this.serverUnit = { personId: 1, x: 0, y: 0, angle: 0, speed: 0 };
        this.scene = {
            bullets: [],
            mobs: [],
            gamers: [],
            tanks: [],
            bodies: [],
            map: {
                dynamic: {
                    houses: [],
                    sands: [],
                    spikes: [],
                    stones: [],
                    stumps: [],
                },
                static: {
                    bushes: [],
                    crossyRoads: [],
                    crossyRoadsEnd: [],
                    crossyRoadsTurn: [],
                    crossyRoadsTurnCont: [],
                    roads: [],
                    trees: [],
                },
            },
        };

        this.keyPressed = {
            Down: false,
            Left: false,
            Right: false,
            Up: false,
            Space: false,
        };

        const { THROW_TO_LOBBY, UPDATE_SCENE, MOVE_UNIT, UPDATE_TIME } =
            mediator.getEventTypes();

        this.user = server.STORE.getUser()?.is_alive ?? null;
        this.unit = getUnit(this.user);

        this.mediator.subscribe(UPDATE_SCENE, (scene: IMap) => {
            const updateHouses = scene.dynamic.houses.map((house) => ({
                ...house,
                y: house.y + house.sizeY,
            }));
            const updatedSands = scene.dynamic.sands.map((sand) => ({
                ...sand,
                y: sand.y + sand.sizeY,
            }));

            scene.dynamic.houses = updateHouses;
            scene.dynamic.sands = updatedSands;

            this.scene.map = scene;
            this.scene.map.static = { ...scene.static, ...staticMap };

            console.log(this.scene);
            
        });

        this.mediator.subscribe(MOVE_UNIT, () => {
            this.unitMotion();
        });

        this.unitMotion();
        this.server.getMap();
    }

    getScene() {
        return this.scene;
    }

    keyDown(key: EKeys) {
        this.keyPressed[key] = true;
    }

    keyUp(key: EKeys) {
        this.keyPressed[key] = false;
    }

    getUnit() {
        return this.unit;
    }

    unitShot() {
        if (this.user) {
            const { x, y, angle, weaponLength } = this.unit;
            const { personId: role } = this.user;
            if (
                role !== EGamerRole.heavyTankCommander &&
                role !== EGamerRole.heavyTankMeh &&
                role !== EGamerRole.middleTankMeh &&
                role !== EGamerRole.bannerman
            ) {
                this.server.makeShot(
                    x + Math.cos(angle) * weaponLength,
                    y + Math.sin(angle) * weaponLength,
                    angle
                );
            }
        }
    }

    unitMotion() {
        if (this.user) {
            const { x, y, angle } = this.unit;
            const { personId: role } = this.user;
            if (
                role !== EGamerRole.middleTankGunner &&
                role !== EGamerRole.heavyTankGunner &&
                role !== EGamerRole.heavyTankCommander
            ) {
                this.server.unitMotion(x, y, angle);
            } else {
                this.server.unitMotion(null, null, angle);
                if (this.serverUnit) {
                    this.unit.x = this.serverUnit.x;
                    this.unit.y = this.serverUnit.y;
                }
            }

            if (
                this.keyPressed.Space &&
                (role === EGamerRole.infantry ||
                    role === EGamerRole.infantryRPG ||
                    role === EGamerRole.middleTankGunner ||
                    role === EGamerRole.heavyTankGunner)
            ) {
                // makeShot();
            }
        }
    }
}
