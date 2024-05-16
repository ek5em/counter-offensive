import { FC, useEffect } from "react";
import {
    MAP_SIZE,
    WINConf,
    entitiesConfig,
    objectConf,
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
    IMap,
    IMapObject,
    IMob,
    ITank,
} from "../../../../modules/Server/interfaces";
import { useGlobalContext } from "../../../../hooks/useGlobalContext";
import useCanvas from "../../hooks/useCanvas";
import useSprites, { SpriteFrame } from "../../hooks/useSprites";
import { Canvas, Collision, Game, TraceMask, General } from "../../modules";
import { EKeys, IGameScene } from "../../modules/Game/Game";

import styles from "./GameCanvas.module.scss";

interface GameCanvasProps {
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const GameCanvas: FC<GameCanvasProps> = ({ inputRef }) => {
    const { server, mediator } = useGlobalContext();
    const canvasId = "canvas";

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

        /* tracer = new TraceMask({
            WIN,
            canvas,
            mediator,
            width,
            height,
            cellSize: SPRITE_SIZE,
        }); */
        return () => {
            canvas = null;
            tracer = null;
        };
    });

    const SPRITE_SIZE = width / WIN.width;
    const SIZE = 50;

    const [
        img,
        boom,
        middleTank,
        heavyTank,
        grassSprite,
        stoneSprite,
        bushSprite,
        stumpSprite,
        spikeSprite,
        boxSprite,
        sandSprite,
        treeSprite,
        houseSprite,
        verandaSprite,
        wallSprite,
        roadSprite,
        crossyRoadEndSprite,
        crossyRoadSprite,
        crossyRoadTurnSprite,
        crossyRoadTurnContSprite,
        fenceSprite,
        fenceTurnSprite,
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
    });

    const collision = new Collision(game.getScene());

    const mousePos: TPoint = {
        x: 0,
        y: 0,
    };

    // Callbacks

    const keyDownHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                game.keyDown(EKeys.Up);
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                game.keyDown(EKeys.Down);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                game.keyDown(EKeys.Right);
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                game.keyDown(EKeys.Left);
            }
            if (e.code === "Space") {
                game.unitShot();
                game.keyDown(EKeys.Space);
            }
        }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
        if (inputRef.current !== document.activeElement) {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                game.keyUp(EKeys.Up);
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                game.keyUp(EKeys.Down);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                game.keyUp(EKeys.Right);
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                game.keyUp(EKeys.Left);
            }
            if (e.code === "Space") {
                game.keyUp(EKeys.Space);
            }
        }
    };

    const mouseMoveHandler = (e: MouseEvent) => {
        mousePos.x = e.offsetX;
        mousePos.y = e.offsetY;
    };

    const mouseUpHandler = () => {
        game.keyPressed.Space = false;
    };

    const mouseDownHandler = () => {
        game.unitShot();
        game.keyDown(EKeys.Space);
    };

    /* БЛОК ПРО РИСОВАНИЕ */

    const drawWalls = (walls: TPoint[][]) => {
        walls.forEach((block) => {
            for (let i = block[1].x; i < block[3].x; i++) {
                for (let j = block[1].y; j > block[3].y; j--) {
                    canvas?.spriteMap(img, i, j, ...wallSprite);
                }
            }
        });
    };

    const drawGrass = () => {
        for (let i = 0; i < MAP_SIZE.width; i += 5) {
            for (let j = MAP_SIZE.height; j > 0; j -= 5) {
                canvas?.spriteMap(img, i, j, ...grassSprite);
            }
        }
    };

    const drawHouses = (houses: IMapObject[]) => {
        houses.forEach((house) => {
            const { x, y, sizeY, sizeX, angle } = house;
            const isVert = sizeY > sizeX;
            canvas?.spriteDir(img, x, y, ...houseSprite, isVert ? 270 : 0);
            switch (angle) {
                case 0: {
                    return canvas?.spriteDir(
                        img,
                        x + sizeX / 2 - 1,
                        y - sizeY + 0.5,
                        ...verandaSprite,
                        -angle + 180
                    );
                }
                case 90: {
                    return canvas?.spriteDir(
                        img,
                        x + sizeX - 0.5,
                        y - sizeY / 2 + 1,
                        ...verandaSprite,
                        -angle + 180
                    );
                }
                case 180: {
                    return canvas?.spriteDir(
                        img,
                        x + sizeX / 2 - 1,
                        y + sizeY / 2,
                        ...verandaSprite,
                        -angle + 180
                    );
                }
                case 270: {
                    return canvas?.spriteDir(
                        img,
                        x - sizeX / 2,
                        y - sizeY / 2 + 1,
                        ...verandaSprite,
                        -angle + 180
                    );
                }
            }
        });
    };

    const drawSands = (sands: IMapObject[]) => {
        sands.forEach((sand) => {
            const { angle, sizeX, sizeY, x, y } = sand;

            switch (angle) {
                case 0: {
                    return canvas?.spriteDir(
                        img,
                        x,
                        y + 0.5,
                        ...sandSprite,
                        -angle
                    );
                }
                case 90: {
                    return canvas?.spriteDir(
                        img,
                        x,
                        y - 0.1,
                        ...sandSprite,
                        -angle
                    );
                }
                case 180: {
                    return canvas?.spriteDir(
                        img,
                        x - 0.2,
                        y + sizeX,
                        ...sandSprite,
                        -angle
                    );
                }
                case 270: {
                    return canvas?.spriteDir(
                        img,
                        x - sizeY + 0.5,
                        y - 0.1,
                        ...sandSprite,
                        -angle
                    );
                }
            }
        });
    };

    const drawCircleObj = ({ x, y, r }: TCircle, sprite: SpriteFrame) => {
        canvas?.spriteMap(img, x - r, y + r, ...sprite);
    };

    const drawSpikes = (spikes: IMapObject[]) => {
        spikes.forEach((spike) => {
            const { x, y } = spike;
            canvas?.sprite(img, x, y, ...spikeSprite);
        });
    };

    const drawStones = (stones: IMapObject[]) => {
        const { r } = objectConf.stone;
        stones.forEach((stone) => {
            const { x, y } = stone;
            drawCircleObj({ x, y, r }, stoneSprite);
        });
    };

    const drawStumps = (stumps: IMapObject[]) => {
        const { r } = objectConf.stump;
        stumps.forEach((stump) => {
            const { x, y } = stump;
            drawCircleObj({ x, y, r }, stumpSprite);
        });
    };

    const drawTrees = (trees: IMapObject[]) => {
        trees.forEach((tree) => {
            const { x, y } = tree;
            canvas?.spriteMap(img, x, y, ...treeSprite);
        });
    };

    const drawBushes = (bushes: IMapObject[]) => {
        const { r } = objectConf.bush;
        bushes.forEach((bush) => {
            const { x, y } = bush;
            drawCircleObj({ x, y, r }, bushSprite);
        });
    };

    const drawRoads = (roads: IMapObject[]) => {
        roads.forEach((road) => {
            const { x, y, sizeY } = road;
            for (let i = 1; i <= sizeY / 4; i++) {
                canvas?.sprite(img, x, y + i * 4, ...roadSprite);
            }
        });
    };

    const drawCrossyRoads = (roads: IMapObject[]) => {
        roads.forEach((road) => {
            const { x, y, sizeX, sizeY, angle } = road;
            if (sizeX > sizeY) {
                for (let i = 0; i < sizeX / 2; i++) {
                    canvas?.spriteDir(
                        img,
                        x + i * 2,
                        y + sizeY,
                        ...crossyRoadSprite,
                        angle
                    );
                }
            } else {
                for (let i = 1; i <= sizeY / 2; i++) {
                    canvas?.spriteDir(
                        img,
                        x,
                        y + i * 2,
                        ...crossyRoadSprite,
                        angle
                    );
                }
            }
        });
    };

    const drawCrossyRoadsEnd = (roads: IMapObject[]) => {
        roads.forEach((road) => {
            const { x, y, sizeY, angle } = road;
            canvas?.spriteDir(
                img,
                x,
                y + sizeY,
                ...crossyRoadEndSprite,
                -angle
            );
        });
    };

    const drawCrossyRoadsTurn = (roads: IMapObject[]) => {
        roads.forEach((road) => {
            const { x, angle, sizeY, y } = road;
            canvas?.spriteDir(
                img,
                x,
                y + sizeY,
                ...crossyRoadTurnSprite,
                -angle
            );
        });
    };

    const drawCrossyRoadsTurnCont = (roads: IMapObject[]) => {
        roads.forEach((road) => {
            const { x, angle, sizeY, y } = road;
            canvas?.spriteDir(
                img,
                x,
                y + sizeY,
                ...crossyRoadTurnContSprite,
                -angle
            );
        });
    };

    const drawObjects = (map: IMap) => {
        const { houses, sands, spikes, stones, stumps } = map.dynamic;
        const {
            bushes,
            trees,
            roads,
            crossyRoads,
            crossyRoadsEnd,
            crossyRoadsTurn,
            crossyRoadsTurnCont,
        } = map.static;

        drawGrass();
        drawWalls(walls);
        // drawCrossyRoads(crossyRoads);
        drawCrossyRoadsEnd(crossyRoadsEnd);
        // drawCrossyRoadsTurn(crossyRoadsTurn);
        // drawCrossyRoadsTurnCont(crossyRoadsTurnCont);
        drawRoads(roads);

        drawTrees(trees);
        drawBushes(bushes);

        drawHouses(houses);
        drawSands(sands);
        drawSpikes(spikes);
        drawStones(stones);
        drawStumps(stumps);

        /* map.forEach((obj) => {
            const { x, y, angle, sizeX, sizeY } = obj;
            switch (obj.type) {
                case EMapObject.base: {
                    const { innerColor: c1, outerColor: c2 } = objectConf.base;
                    const r = obj.r ? obj.r : objectConf.base.r;
                    canvas?.circle({ x, y, r }, c2);
                    canvas?.circle({ x, y, r: r * 0.9 }, c1);
                    return;
                }
        }); */
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
        const unit = game.getUnit();
        const { left, bottom, width, height } = WIN;
        const vectorToBase = {
            x: base.x - unit.x,
            y: base.y - unit.y,
        };

        if (
            Math.abs(vectorToBase.y) > height / 2 + objectConf.base.r ||
            Math.abs(vectorToBase.x) > width / 2 + objectConf.base.r
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
        const unit = game.getUnit();
        const { bodies, bullets, gamers, mobs, map, tanks } = scene;
        drawObjects(map);
        drawBodies(bodies);
        drawBullets(bullets);
        drawMobs(mobs);
        drawTanks(tanks);

        !(unit instanceof General) && tracer?.trace(unit, WIN);

        drawGamers(gamers);
        const base = null; /* map.find((el) => el.type === EMapObject.base); */
        base && showEnemyBase(base);
    };

    const updateWIN = () => {
        const { x, y } = game.getUnit();
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
        const unit = game.getUnit();
        if (canvas) {
            const { x, y } = unit;
            const { down, left, right, up } = visualBorders;
            if (unit instanceof General) {
                unit.move(game.keyPressed, time);
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
                unit.move(game.keyPressed, time);
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
    };

    function render(FPS: number) {
        const unit = game.getUnit();
        const renderTime = FPS ? 1000 / FPS : 0;
        const scene = game.getScene();
        if (canvas) {
            canvas.clear();
            drawScene(scene);
            updateUnit(renderTime);
            updateEntity(scene, renderTime);
            canvas.circle({ ...unit });
            canvas.render();
        }
    }

    return <canvas id={canvasId} className={styles.game_scene} />;
};

export default GameCanvas;
