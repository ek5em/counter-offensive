import { Mediator, Server } from "../../../../modules";
import {
    EGamerRole,
    IBody,
    IBullet,
    IGamer,
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
    map: IMapObject[];
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
            map: [],
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

        this.mediator.subscribe(UPDATE_SCENE, (scene: IScene) => {
            const {
                bodies,
                bullets,
                gamer,
                gamers,
                gametime,
                is_dead,
                is_end,
                map,
                mobBase,
                mobs,
                tanks,
            } = scene;

            if (bodies) {
                this.scene.bodies = bodies;
            }

            if (bullets) {
                this.scene.bullets = bullets;
            }

            if (gamers) {
                this.scene.gamers = gamers;
            }

            if (mobs) {
                this.scene.mobs = mobs;
            }

            if (tanks) {
                this.scene.tanks = tanks;
            }

            if (gamer) {
                this.serverUnit = gamer;
            }
        });

        this.mediator.subscribe(MOVE_UNIT, () => {
            this.unitMotion();
        });

        this.unitMotion();
        this.server.getScene();
    }

    getScene() {
        return this.scene;
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
}
