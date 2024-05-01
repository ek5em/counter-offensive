import { FC, useEffect } from "react";
import {
    MAP_SIZE,
    WINConf,
    entitiesConfig,
    objectConf,
    requestDelay,
    walls,
} from "../../../../config";
import { TCircle, TPoint } from "../../types";
import {
    EBody,
    EGamerRole,
    EMapObject,
    EProjectile,
    ETank,
    IBody,
    IBullet,
    IGamer,
    IMapObject,
    IMob,
    ITank,
} from "../../../../modules/Server/interfaces";
import { useGlobalContext } from "../../../../hooks/useGlobalContext";
import useCanvas from "../../hooks/useCanvas";
import useSprites, { SpriteFrame } from "../../hooks/useSprites";
import { getUnit } from "./getUnit";
import { Canvas, Collision, Game, TraceMask, General } from "../../modules";
import { IGameScene } from "../../modules/Game/Game";

import styles from "./GameCanvas.module.scss";

export interface IPressedKeys {
    Up: boolean;
    Down: boolean;
    Right: boolean;
    Left: boolean;
    Space: boolean;
}

interface GameCanvasProps {
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const GameCanvas: FC<GameCanvasProps> = ({ inputRef }) => {
    const { server, mediator } = useGlobalContext();

    const canvasId = "canvas";

    const user = server.STORE.getUser()?.is_alive;
    const unit = getUnit(user);

    const updateUnitInterval = setInterval(() => {
        const { x, y, angle } = unit;
        if (user) {
            const userUnit = user.personId;
            if (
                userUnit !== EGamerRole.middleTankGunner &&
                userUnit !== EGamerRole.heavyTankGunner &&
                userUnit !== EGamerRole.heavyTankCommander
            ) {
                server.unitMotion(x, y, angle);
            } else {
                server.unitMotion(null, null, angle);
                if (game.serverUnit) {
                    unit.x = game.serverUnit.x;
                    unit.y = game.serverUnit.y;
                }
            }

            if (
                keyPressed.Space &&
                (userUnit === EGamerRole.infantry ||
                    userUnit === EGamerRole.infantryRPG ||
                    userUnit === EGamerRole.middleTankGunner ||
                    userUnit === EGamerRole.heavyTankGunner)
            ) {
                makeShot();
            }
        }
    }, requestDelay.gamerUpdate);

    const height = window.innerHeight;
    const width = window.innerWidth;
    const prop = width / height;
    const WIN = {
        left: -1,
        bottom: -1,
        width: WINConf.width * prop,
        height: WINConf.height,
    };
    const halfW = WIN.width / 2;
    const halfH = WIN.height / 2;
    const visualBorders = {
        left: halfW - 1,
        right: MAP_SIZE.width - halfW + 1,
        up: MAP_SIZE.height - halfH + 1,
        down: halfH - 1,
    };

    let tracer: TraceMask | null = null;
    let canvas: Canvas | null = null;
    const createCanvas = useCanvas(render);

    useEffect(() => {
        canvas = createCanvas({
            height,
            width,
            id: canvasId,
            WIN,
            callbacks: {
                keydown: keyDownHandler,
                keyup: keyUpHandler,
                mousemove: mouseMoveHandler,
                mouseDown: mouseDownHandler,
                mouseUp: mouseUpHandler,
            },
        });
        tracer = new TraceMask({
            WIN,
            canvas,
            mediator,
            width,
            height,
            cellSize: SPRITE_SIZE,
        });
        return () => {
            canvas = null;
            tracer = null;
            clearInterval(game.interval);
            clearInterval(updateUnitInterval);
        };
    });

    const SPRITE_SIZE = width / WIN.width;
    const SIZE = 50;

    const [
        img,
        boom,
        middleTank,
        heavyTank,
        grass,
        stone,
        bush,
        stump,
        spike,
        box,
        sand,
        tree,
        home,
        veranda,
        wall,
        road,
        crossyRoadEnd,
        crossyRoad,
        crossyRoadTurn,
        crossyRoadTurnCont,
        fence,
        fenceTurn,
        bulletAutomat,
        bulletRPG,
        manDead,
        manRPG,
        manAutomat,
        manFlag,
        mobDead,
        mobRPG,
        mobAutomat,
        corpusTank2,
        corpusTank3,
        towerTank2,
        towerTank3,
        corpusTank2Dead,
        corpusTank3Dead,
        towerTank2Dead,
        towerTank3Dead,
    ] = useSprites(SPRITE_SIZE, SIZE);

    const game = new Game({
        server,
        mediator,
        cbs: {
            roundEnd,
        },
    });

    const collision = new Collision(game.getScene());

    const keyPressed: IPressedKeys = {
        Down: false,
        Up: false,
        Right: false,
        Left: false,
        Space: false,
    };

    const mousePos: TPoint = {
        x: 0,
        y: 0,
    };

    // Callbacks

    const keyDownHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                keyPressed.Up = true;
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                keyPressed.Down = true;
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                keyPressed.Right = true;
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                keyPressed.Left = true;
            }
            if (e.code === "Space") {
                makeShot();
                keyPressed.Space = true;
            }
        }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                keyPressed.Up = false;
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                keyPressed.Down = false;
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                keyPressed.Right = false;
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                keyPressed.Left = false;
            }
            if (e.code === "Space") {
                keyPressed.Space = false;
            }
        }
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    };

    const mouseUpHandler = () => {
        keyPressed.Space = false;
    };

    const mouseDownHandler = () => {
        makeShot();
        keyPressed.Space = true;
    };

    const makeShot = () => {
        const { x, y, angle, weaponLength } = unit;
        if (user) {
            const userUnit = user.personId;
            if (
                userUnit !== EGamerRole.heavyTankCommander &&
                userUnit !== EGamerRole.heavyTankMeh &&
                userUnit !== EGamerRole.middleTankMeh &&
                userUnit !== EGamerRole.bannerman
            ) {
                server.makeShot(
                    x + Math.cos(angle) * weaponLength,
                    y + Math.sin(angle) * weaponLength,
                    angle
                );
            }
        }
    };

    /* БЛОК ПРО РИСОВАНИЕ */

    const drawWalls = (walls: TPoint[][]) => {
        walls.forEach((block) => {
            for (let i = block[1].x; i < block[3].x; i++) {
                for (let j = block[1].y; j > block[3].y; j--) {
                    canvas?.spriteMap(img, i, j, ...wall);
                }
            }
        });
    };

    const drawGrass = () => {
        for (let i = 0; i < MAP_SIZE.width; i += 5) {
            for (let j = MAP_SIZE.height; j > 0; j -= 5) {
                canvas?.spriteMap(img, i, j, ...grass);
            }
        }
    };

    const drawHouse = (house: IMapObject) => {
        const { x, y, sizeY, sizeX, isVert, angle } = house;
        canvas?.spriteDir(img, x, y, ...home, isVert ? (3 * Math.PI) / 2 : 0);
        switch (angle) {
            case 0: {
                return canvas?.spriteDir(
                    img,
                    x + sizeX / 2 - 1,
                    y - sizeY + 0.5,
                    ...veranda,
                    -angle + Math.PI
                );
            }
            case Math.PI / 2: {
                return canvas?.spriteDir(
                    img,
                    x + sizeX - 0.5,
                    y - sizeY / 2 + 1,
                    ...veranda,
                    -angle + Math.PI
                );
            }
            case Math.PI: {
                return canvas?.spriteDir(
                    img,
                    x + sizeX / 2 - 1,
                    y + sizeY / 2,
                    ...veranda,
                    -angle + Math.PI
                );
            }
            case (3 * Math.PI) / 2: {
                return canvas?.spriteDir(
                    img,
                    x - sizeX / 2,
                    y - sizeY / 2 + 1,
                    ...veranda,
                    -angle + Math.PI
                );
            }
        }
    };

    const drawCircleObj = ({ x, y, r }: TCircle, sprite: SpriteFrame) => {
        canvas?.spriteMap(img, x - r, y + r, ...sprite);
    };

    const drawObjects = (objects: IMapObject[]) => {
        drawGrass();
        drawWalls(walls);
        objects.forEach((obj) => {
            const { x, y, angle, sizeX, sizeY } = obj;
            switch (obj.type) {
                case EMapObject.house: {
                    return drawHouse(obj);
                }
                case EMapObject.stone: {
                    const { r } = objectConf.stone;
                    return drawCircleObj({ x, y, r }, stone);
                }
                case EMapObject.stump: {
                    const { r } = objectConf.stump;
                    return drawCircleObj({ x, y, r }, stump);
                }
                case EMapObject.bush: {
                    const { r } = objectConf.bush;
                    return drawCircleObj({ x, y, r }, bush);
                }
                case EMapObject.tree: {
                    canvas?.spriteMap(img, x, y, ...tree);
                    break;
                }
                case EMapObject.sand: {
                    switch (angle) {
                        case 0: {
                            return canvas?.spriteDir(
                                img,
                                x,
                                y + 0.5,
                                ...sand,
                                -angle
                            );
                        }
                        case Math.PI / 2: {
                            return canvas?.spriteDir(
                                img,
                                x,
                                y - 0.1,
                                ...sand,
                                -angle
                            );
                        }
                        case Math.PI: {
                            return canvas?.spriteDir(
                                img,
                                x - 0.2,
                                y + sizeX,
                                ...sand,
                                -angle
                            );
                        }
                        case (3 * Math.PI) / 2: {
                            return canvas?.spriteDir(
                                img,
                                x - sizeY + 0.5,
                                y - 0.1,
                                ...sand,
                                -angle
                            );
                        }
                    }
                    return;
                }
                case EMapObject.base: {
                    const { innerColor: c1, outerColor: c2 } = objectConf.base;
                    const r = obj.r ? obj.r : objectConf.base.r;
                    canvas?.circle({ x, y, r }, c2);
                    canvas?.circle({ x, y, r: r * 0.9 }, c1);
                    return;
                }
                case EMapObject.box: {
                    return canvas?.sprite(img, x, y, ...box);
                }
                case EMapObject.spike: {
                    return canvas?.sprite(img, x, y, ...spike);
                }
                case EMapObject.road: {
                    for (let i = 1; i <= sizeY / 4; i++) {
                        canvas?.sprite(img, x, y + i * 4, ...road);
                    }
                    return;
                }
                case EMapObject.crossyRoad: {
                    if (sizeX > sizeY) {
                        for (let i = 0; i < sizeX / 2; i++) {
                            canvas?.spriteDir(
                                img,
                                x + i * 2,
                                y + sizeY,
                                ...crossyRoad,
                                angle
                            );
                        }
                    } else {
                        for (let i = 1; i <= sizeY / 2; i++) {
                            canvas?.spriteDir(
                                img,
                                x,
                                y + i * 2,
                                ...crossyRoad,
                                angle
                            );
                        }
                    }
                    return;
                }
                case EMapObject.crossyRoadEnd: {
                    return canvas?.spriteDir(
                        img,
                        x,
                        y + sizeY,
                        ...crossyRoadEnd,
                        -angle
                    );
                }
                case EMapObject.crossyRoadTurn: {
                    canvas?.spriteDir(
                        img,
                        x,
                        y + sizeY,
                        ...crossyRoadTurn,
                        -angle
                    );
                    return;
                }
                case EMapObject.crossyRoadTurnCont: {
                    return canvas?.spriteDir(
                        img,
                        x,
                        y + sizeY,
                        ...crossyRoadTurnCont,
                        angle
                    );
                }

                case EMapObject.trusovMoment: {
                    //return canvas?.spriteDir(img, x, y, ...fence, -angle);
                }
            }
        });
    };

    const drawBullets = (bullets: IBullet[]) => {
        bullets.forEach((bullet) => {
            const { x, y, type, dx, dy } = bullet;
            const bulletSprite: SpriteFrame =
                type === EProjectile.grenade ? bulletRPG : bulletAutomat;
            canvas?.spriteDir(
                img,
                x - 0.5,
                y + 0.5,
                ...bulletSprite,
                Math.PI / 2 - Math.atan2(dy, dx)
            );
        });
    };

    const drawMobs = (mobs: IMob[]) => {
        mobs.forEach((mob) => {
            const mobSprite: SpriteFrame =
                mob.person_id === EGamerRole.infantry ? mobAutomat : mobRPG;
            canvas?.spriteDir(
                img,
                mob.x - 1,
                mob.y + 1,
                ...mobSprite,
                Math.PI / 2 - mob.angle
            );
        });
    };

    const drawTanks = (tanks: ITank[]) => {
        tanks.forEach((tank) => {
            const corpus: SpriteFrame =
                tank.type === ETank.middle ? corpusTank2 : corpusTank3;
            const tower: SpriteFrame =
                tank.type === ETank.middle ? towerTank2 : towerTank3;
            canvas?.spriteDir(
                img,
                tank.x - 3,
                tank.y + 3,
                ...corpus,
                -tank.angle
            );
            canvas?.spriteDir(
                img,
                tank.x - 3,
                tank.y + 3,
                ...tower,
                -tank.tower_angle
            );
        });
    };

    const drawGamers = (gamers: IGamer[]) => {
        gamers.forEach((gamer) => {
            let gamerSprite: SpriteFrame | null = null;
            switch (gamer.person_id) {
                case EGamerRole.bannerman: {
                    gamerSprite = manFlag;
                    break;
                }
                case EGamerRole.infantry: {
                    gamerSprite = manAutomat;
                    break;
                }
                case EGamerRole.infantryRPG: {
                    gamerSprite = manRPG;
                    break;
                }
                default: {
                    return;
                }
            }
            canvas?.spriteDir(
                img,
                gamer.x - 1,
                gamer.y + 1,
                ...gamerSprite,
                Math.PI / 2 - gamer.angle
            );
        });
    };

    const drawBodies = (bodies: IBody[]) => {
        bodies.forEach((body) => {
            const { angle, type, x, y, isMob } = body;
            if (isMob) {
                canvas?.circle({ ...body, r: 0.5 }, "#F00");
                canvas?.spriteDir(
                    img,
                    x - 1,
                    y + 1,
                    ...mobDead,
                    Math.PI / 2 - angle
                );
                return;
            }
            switch (type) {
                case EBody.man: {
                    canvas?.circle({ ...body, r: 0.5 }, "#F00");
                    canvas?.spriteDir(
                        img,
                        x - 1,
                        y + 1,
                        ...manDead,
                        Math.PI / 2 - angle
                    );
                    break;
                }
                case EBody.middleTank: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...corpusTank2Dead,
                        angle
                    );
                    break;
                }
                case EBody.middleTower: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...towerTank2Dead,
                        -angle
                    );
                    break;
                }
                case EBody.heavyTank: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...corpusTank3Dead,
                        angle
                    );
                    break;
                }
                case EBody.heavyTower: {
                    canvas?.spriteDir(
                        img,
                        x - 3,
                        y + 3,
                        ...towerTank3Dead,
                        -angle
                    );
                    break;
                }
            }
        });
    };

    const showEnemyBase = (base: IMapObject) => {
        const { left, bottom, width, height } = WIN;
        const vectorToBase = {
            x: base.x - unit.x,
            y: base.y - unit.y,
        };

        if (
            Math.abs(vectorToBase.y) > height / 2 + base.r ||
            Math.abs(vectorToBase.x) > width / 2 + base.r
        ) {
            let x = base.x,
                y = base.y;
            if (x > left + width) {
                x = left + width;
            }
            if (y > bottom + height) {
                y = bottom + height;
            }
            if (y < bottom) {
                y = bottom;
            }
            if (x < left) {
                x = left;
            }

            canvas?.circle(
                {
                    x,
                    y,
                    r: 0.5,
                },
                "#f00"
            );
        }
    };

    const drawScene = (scene: IGameScene) => {
        const { bodies, bullets, gamers, mobs, map, tanks } = scene;
        drawObjects(map);
        drawBodies(bodies);
        drawBullets(bullets);
        drawMobs(mobs);
        drawTanks(tanks);

        !(unit instanceof General) && tracer?.trace(unit, WIN);

        drawGamers(gamers);
        const base = map.find((el) => el.type === EMapObject.base);
        base && showEnemyBase(base);
    };

    const updateWIN = () => {
        const { x, y } = unit;
        const { left, right, down, up } = visualBorders;
        WIN.left = x - halfW;
        WIN.bottom = y - halfH;
        if (y < down) {
            WIN.bottom = -1;
        }
        if (y > up) {
            WIN.bottom = MAP_SIZE.height - WIN.height + 1;
        }
        if (x < left) {
            WIN.left = -1;
        }
        if (x > right) {
            WIN.left = MAP_SIZE.width - WIN.width + 1;
        }
    };

    const updateEntity = (scene: IGameScene, time: number) => {
        scene.bullets.forEach((bullet) => {
            bullet.x += bullet.dx * (entitiesConfig.bulletSpeed / time);
            bullet.y += bullet.dy * (entitiesConfig.bulletSpeed / time);
        });
    };

    const updateUnit = (time: number) => {
        if (game.serverUnit) {
            if (canvas) {
                const { x, y } = unit;
                const { down, left, right, up } = visualBorders;
                if (unit instanceof General) {
                    unit.move(keyPressed, time);
                    if (x < left) {
                        unit.x = left;
                    }
                    if (y < down) {
                        unit.y = down;
                    }
                    if (x > right) {
                        unit.x = right;
                    }
                    if (y > up) {
                        unit.y = up;
                    }
                } else {
                    unit.move(keyPressed, time);
                    collision.checkAllBlocksUnit(unit);
                    unit.rotate(
                        Math.atan2(
                            canvas.sy(mousePos.y) - y,
                            canvas.sx(mousePos.x) - x
                        )
                    );
                }
                updateWIN();
            }
        }
    };

    function roundEnd() {}

    function render(FPS: number) {
        const renderTime = FPS ? 1000 / FPS : 0;
        const scene = game.getScene();
        if (canvas) {
            canvas.clear();
            drawScene(scene);
            updateUnit(renderTime);
            updateEntity(scene, renderTime);
            canvas.render();
        }
    }

    return <canvas id={canvasId} className={styles.game_scene} />;
};

export default GameCanvas;
