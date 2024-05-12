const BaseModule = require('../BaseModule/BaseModule');
const Mob = require("./Mob.js");
const Bullet = require("./Bullet.js");
const GameMath = require('./GameMath');
const easystarjs = require('easystarjs');

const { SOCKETS, tankRoles, footRoles } = require("../../../config.js");

class GameManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);

        this.easystar = new easystarjs.js();
        this.gameMath = new GameMath();

        this.tanks = {};
        // id
        this.mobId = 0;
        this.objectId = 0;
        // 
        this.map;
        this.bullets = {};
        this.mobs = {};
        this.tanks = {};
        this.objects = {
            static: {},
            dynamic: {}
        };
        this.gameState;


        this.mediator.set(this.TRIGGERS.GAME_TANKS, () => this.tanks);

        this.getObjects();
        this.fillMap();

        setInterval(this.updateScene(), 1000);
    }



    getTankByGunnerId(gunnerId) {
        for (const tank of Object.values(this.tanks)) {
            if(tank.gunnerId === gunnerId) {
                return tank;
            }
        }
    }

    getGamers() {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        const gamers = [];
        for (const [id, user] of Object.entries(users)) {
            if(user.roleId) {
                gamers.push({id: id, user: user});
            }
        }
        return gamers;
    }

    // Выстрел 
    tankFire(user, x, y, angle) {
        let tank = this.getTankByGunnerId(user.id);
        if (tank.fire()) {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const bullet = new Bullet(user.id, x + dx, y + dy, dx, dy, 1);
            this.bullets[this.bulletsId] = bullet;
            this.bulletId +=1;
            tank.updateTimestamp();
        }
    }

    infantryFire(user, x, y, angle, bulletType) {
        if (user.fire()) {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const bullet = new Bullet(user.id, x + 0.3 * dx, y + 0.3 * dy, dx, dy, bulletType);
            this.bullets[this.bulletsId] = bullet;
            this.bulletId +=1;
            user.updateReloadTimestamp();
        }
    }

    mobFire(mob, x, y, angle, personId) {
        if(mob.fire()) {
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);
            let bulletType = personId === 9 ? 1 : 0;
            const bullet = new Bullet(null, x + dx, y + dy, dx, dy, bulletType);
            this.bullets[this.bulletsId] = bullet;
            this.bulletId +=1;
            mob.updateReloadTimestamp();
        }
        
    }

    /*Map*/
    checkMap() {
        if (!this.map) {
            this.fillMap()
        };
    }

    async getObjects() { 
        if (!Object.keys(this.map.static).length) {
            const objects = await this.db.getStaticObjects();
            this.objects.static = objects.reduce((acc, objects) => {
                acc[objects.experience] = {
                    hp: objects.hp,
                    x: objects.x,
                    y: objects.y,
                    sizeX: objects.sizeX,
                    sizeY: objects.sizeY,
                    status: objects.status
                } 
                return acc;
            }, {});
        }
        const objects = await this.db.getDynamicObjects();
        this.objects.dynamic = objects.reduce((acc, objects) => {
            acc[objects.experience] = {
                hp: objects.hp,
                x: objects.x,
                y: objects.y,
                sizeX: objects.sizeX,
                sizeY: objects.sizeY,
                status: objects.status
            } 
            return acc;
        }, {});

    }

    fillMap() {
        // Алгоритм не хочет работать с прямоугольной картой. Проблем с таким способом создания квадратной не возникает
        this.map = Array(151).fill([Array(151).fill(0)]);
        const grid = Array(151).fill([Array(151).fill(0)]);
        for (const [id, object] of Object.entries(this.objects.dynamic)) {
            for (let i = object.x; i < object.x + object.sizeX + 1; i++) {
                for (let j = object.y; j < object.y + object.sizeY + 1; j++) {
                    this.map[i][j] = 1;
                    grid[j][i] = 1;
                }
            }
        }
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles([0]);
    }

    /* Mobs */

    generatePointWithoutObject(x1, x2, y1, y2) {
        let xs = Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
        let ys = Math.floor(Math.random() * (y2 - y1 + 1)) + y1;

        if (this.map[xs][ys] === 0) {
            return [xs, ys];
        }
        else return this.generatePointWithoutObject(x1, x2, y1, y2);
    }

    addSquad(params) {
        let mobsCounter = 0;
        for (let mob of this.mobs) {
            if (mob.x > params[0] && mob.x < params[1] && mob.y > params[2] && mob.y < params[3])
                mobsCounter++;
        }
        if (mobsCounter < params[8]) {
            for (let i = mobsCounter; i < params[8]; i++) {
                let point = this.generatePointWithoutObject(params[4], params[5], params[6], params[7]);
                
                const mob = new Mob(point[0], point[1], Math.floor(Math.random() * (9 - 8 + 1)) + 8);
                this.mobs[this.mobId] = mob;
                this.mobId++;
            }
        }
    }


    addMobs() {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
        let mobsCount = Object.keys(this.mobs).length;
        let gamerCount = 3 * Object.keys(users).length + 4 * Object.keys(this.tanks).length;

        // Максимальное количество мобов
        let allMobsCount = gamerCount + 32

        // Проверяю изменилось ли количество мобов на всей карте
        if (mobsCount >= allMobsCount) return;

        // Координаты отрядов мобов
        let coords = [[90, 140, 70, 115, 110, 140, 95, 115, 4],
        [45, 90, 85, 115, 55, 85, 86, 110, 4],
        [30, 95, 55, 85, 40, 90, 60, 80, 4],
        [96, 124, 14, 75, 100, 117, 22, 70, 4],
        [125, 145, 50, 80, 130, 145, 58, 75, 4],
        [65, 95, 5, 30, 70, 90, 5, 40, 4],
        [5, 30, 55, 95, 5, 20, 60, 90, 4],
        [20, 70, 30, 55, 30, 60, 35, 50, 4]];

        for (let coord of coords) {
            this.addSquad(coord);
        }
    }



    

    findTargetGamer(mob) {
        const users = this.mediator.get(this.TRIGGERS.ALL_USERS).values();
        const allGamers = users.concat(this.tanks.values());

        const targetDistance = 1000;
        let target;

        allGamers.forEach(gamer => {
            // Дистанция до игрока
            let distance = this.gameMath.calculateDistance(mob.x, gamer.x, mob.y, gamer.y);
            if (distance < targetDistance) {
                target = { distance: distance, x: gamer.x, y: gamer.y }
            }
        })
        if (target) {
            return target;
        } else {
            return false;
        }
    }


    async mobAction(mob, angle) {
            this.mobFire(mob.x, mob.y, angle, mob.personId);
            mob.rotate(angle);
    }

    async moveMobs() {
        if (this.getGamers().length === 0 && Objectvalues(this.tanks).length === 0)
            return 0

        for (const [id, mob] of Object.entries(this.mobs)) {
            let path = [];
            // Проверка необходимости обновления пути моба
            if ((Date.now() - mob.pathUpdate > 1000) || mob.path == []) {

                // Поиск целевого игрока
                let targetGamer = this.findTargetGamer(mob);
                if (targetGamer && targetGamer.distance < 25) {

                    //Угол поворота до целевого игрока
                    let angle = this.gameMath.calculateAngle(targetGamer.x, targetGamer.y, mob.x, mob.y);
                    await this.mobAction(mob, angle);

                    // Случай когда моб находится около своей цели и не идет дальше
                    if ((mob.personId === 9 && targetGamer.distance < 4) || (mob.personId === 8 && targetGamer.distance < 2)) {
                        continue;
                    }

                    // Моб ищет путь до своей цели
                    this.easystar.findPath(Math.ceil(mob.x), Math.ceil(mob.y), Math.ceil(targetGamer.x), Math.ceil(targetGamer.y), async (mobPath) => {
                        if (mobPath) {
                            path = mobPath;
                            mob.setPath(path);
                        }
                    });
                    this.easystar.calculate();
                } else { // Моб находится далеко от цели
                    continue;
                } 
            } else { // Действие пути у моба еще активно
                if (mob.path.length && mob.path.length > 0) {
                    const targetCoord = path[path.length - 1];
                    const angle = this.gameMath.calculateAngle(targetCoord.x, targetCoord.y, mob.x, mob.y);
                    await this.mobAction(mob, angle);
                } else continue;
            }


            if (path[1]) {
                // Дистанция пройденная за один рендер
                let distance = mob.movementSpeed * (this.game.timeout / 1000);
                distance = distance > 1 ? 1 : distance;
                const distanceToNextCell = this.gameMath.calculateDistance(mob.x, path[1].x, mob.y, path[1].y);
                const newDistance = distance - distanceToNextCell;
                let newCoords;
             
                if (newDistance > 0) {
                    newCoords = this.gameMath.calculateShiftPoint(path[1].x, path[1].y, path[2].x, path[2].y, newDistance);
                } else {
                    newCoords = this.gameMath.calculateShiftPoint(mob.x, mob.y, path[1].x, path[1].y, distance);
                }

                mob.move(newCoords[0], newCoords[1]);
            }
        }
    }


/* Пули */t

    moveBullets() {
        if (!this.bullets.length) {
            return;
        }
        for (const [id, bullet] of Object.entries(this.bullets)) {
            this.moveBullet(id, bullet);
        }
    }


    async moveBullet(id, bullet) {
        if (bullet.x >= 150 || bullet.x <= 0 || bullet.y >= 120 || bullet.y <= 0) {
            delete this.bullets[id]
        } else {
            bullet.move();
        }
    }


    async shootRegs() {
        if (!this.bullets.length) {
            return 0;
        }
        for (const [bulletId, bullet] of Object.entries(this.bullets)) {
            let currentHp = 0;
            let damage = bullet.type == 0 ? 2 : 50; 
            let shootFlag = false;
            for (const [gamerId, gamer] of this.getGamers()) {
                if (bullet.userId != gamer.id && gamer.hp > 0) {
                    let range = this.gameMath.shootReg(gamer.x, gamer.y, bullet.x, bullet.y, bullet.x + bullet.dx, bullet.y + bullet.dy, 0.2);
                    if (range) {
                        gamer.damage(damage);
                        if(gamer.checkDead()){
                            const users = this.mediator.get(this.TRIGGERS.ALL_USERS);
                            delete users[gamerId];
                            bullet.kill();
                        }
                        delete this.bullets[bulletId];
                        break;
                    }
                }
            }
            if (!shootFlag) {
                for (const [tankId, tank] of Object.entries(this.tanks)) {
                    let range = this.gameMath.shootReg(tank.x, tank.y, bullet.x, bullet.y, bullet.x + bullet.dx, bullet.y + bullet.dy, 0.5);
                    if (range) {
                        tank.damage(damage);
                        if(gamer.checkDead()){
                            delete this.tanks[tankId];
                            bullet.kill();
                        }
                        delete this.bullets[bulletId];
                        break;
                    }
                }
            }

            if (!shootFlag) {
                for (const [mobId, mob] of  Object.entries(this.mobs)) {
                    let range = this.gameMath.shootReg(mob.x, mob.y, bullet.x, bullet.y, bullet.x + bullet.dx, bullet.y + bullet.dy, 0.2);
                    if (range) {
                        mob.damage(damage);
                        if(mob.checkDead()){
                            delete this.mobs[mobId];
                            bullet.kill();
                        }
                        delete this.bullets[bulletId];
                        break;
                    }
                }
            }
            if (!shootFlag) {
                for (const [objectId, object] of Object.entries(this.objects.dynamic)) {
                    if ((bullet.x + bullet.dx >= object.x && bullet.x + bullet.dx <= object.x + object.sizeX) && (bullet.y + bullet.dy >= object.y && bullet.y + bullet.dy <= object.y + object.sizeY)) {
                        if (object.status != 'i') {
                            object.damage(damage);
                            if(object.checkDead()) {
                                delete this.objects.dynamic[objectId];
                            }
                        }
                        delete this.bullets[bulletId];
                        break;
                    }
                }
            }
        }
    }

    // /* Конец игры */
    // async playerBannermanInZone() {
    //     let bannerman = await this.db.getBannerman();
    //     bannerman = bannerman[0];
    //     if (!bannerman) {
    //         if (this.game.pBanner_timestamp != 0) {
    //             await this.db.updatePlayerBannermanTimestamp(0);
    //             this.game.pBanner_timestamp = 0;
    //         }
    //         return false;
    //     }
    //     let dist = this.gameMath.calculateDistance(bannerman.x, bannerman.mobBaseX, bannerman.y, bannerman.mobBaseY);
    //     if (dist <= bannerman.baseRadius) {
    //         if (this.game.pBanner_timestamp == 0) {
    //             await this.db.updatePlayerBannermanTimestamp(this.game.timer);
    //             this.game.pBanner_timestamp = this.game.timer;
    //         }
    //         return true;
    //     }
    //     if (this.game.pBanner_timestamp != 0) {
    //         await this.db.updatePlayerBannermanTimestamp(0);
    //         this.game.pBanner_timestamp = 0;
    //     }
    //     return false;
    // }


    // async endGame() {
    //     let player = await this.playerBannermanInZone();
    //     if (player) {
    //         if (this.game.timer - this.game.pBanner_timestamp >= this.game.banner_timeout) {
    //             await this.db.deleteBodies();
    //             await this.db.deleteBullets();
    //             await this.db.addBannermanExp(400);
    //             await this.db.addWinnerExp(200);
    //             await this.db.deleteTanks();
    //             await this.db.deleteMobs();
    //             await this.db.setWinners();
    //             await this.db.updateObjectsHp();
    //         }
    //     }
    // }




    // Обновление сцены
    updateScene() {
        // Мобы
        this.checkMap();
        this.addMobs();
        this.moveMobs();
        // Пули
        this.moveBullets();
        this.shootRegs();

    }

    async getScene(data = {}) {
        const { token } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER, token);
        const tank = this.getTankByUserId();
        if (user && user.token) {
            if (footRoles.includes(user.roleId)) {
                result.gamer = {
                    'person_id': user.roleId,
                    'x': user.x,
                    'y': user.y,
                    'angle': user.angle,
                    'hp': user.hp
                };
            } else {
                let tank = await this.getTankByUserId(user.id);
                if (tank) {
                    result.gamer = {
                        'person_id': user.roleId,
                        'x': tank.x,
                        'y': tank.y,
                        'angle': tank.angle,
                        'tower_angle': tank.tower_angle,
                        'hp': tank.hp
                    };
                } else result.gamer = null;
            }
        }
        // let gamer = await this.db.getGamerById(userId);
        // let result = {};
        // this.game = await this.db.getGame();
        // this.game = this.game[0];

        // if(["dead", "lobby"].includes(gamer[0].status)){
        //     result.is_dead = true;
        // }



        // Отправлять время в лобби
        // result.gametime = this.game.timer - this.game.startGameTimestamp;



        // if(gamer[0].status == "w"){
        //     result.is_end = 'true';
        // } else await this.update();


        // if([1, 2, 8, 9].includes(gamer[0].person_id)){
        //     result.gamer = {
        //         'person_id': gamer[0].person_id,
        //         'x': gamer[0].x,
        //         'y': gamer[0].y,
        //         'angle': gamer[0].angle,
        //         'hp': gamer[0].hp
        //     };
        // } else{
        //     let tank = await this.db.getTankByUserId(userId);
        //     if(tank[0] && [3, 4, 5, 6, 7].includes(gamer[0].person_id)){
        //         result.gamer = {
        //             'person_id': gamer[0].person_id,
        //             'x': tank[0].x,
        //             'y': tank[0].y,
        //             'angle': tank[0].angle,
        //             'tower_angle': tank[0].tower_angle,
        //             'hp': tank[0].hp
        //         };
        //     } else result.gamer = null;
        // }

        // if (this.game.hashGamers !== hashGamers) {
        //     result.gamers = await this.getGamers();
        //     result.tanks = await this.getTanks();
        //     result.hashGamers = this.game.hashGamers;
        // }

        // if (this.game.hashMobs !== hashMobs) {
        //     result.mobs = await this.getMobs();
        //     result.hashMobs = this.game.hashMobs;
        // }

        // if (this.game.hashBullets !== hashBullets) {
        //     result.bullets = await this.getBullets();
        //     result.hashBullets = this.game.hashBullets;
        // }

        // if (this.game.hashMap !== hashMap) {
        //     result.mobBase = {
        //         x: this.game.mobBase_x,
        //         y: this.game.mobBase_y,
        //         radius: this.game.base_radius
        //     };
        //     result.map = await this.getObjects();
        //     result.hashMap = this.game.hashMap;
        // }

        // if (this.game.hashBodies !== hashBodies) {
        //     result.bodies = await this.getBodies();
        //     result.hashBodies = this.game.hashBodies;
        // }
        // return result;
    }


    async motion(userId, x, y, angle) {
        let gamer = await this.db.getGamerById(userId);

        if (!gamer[0]) return true;

        if ([3, 7].includes(gamer[0].person_id)) {
            if (typeof angle === 'number') {
                await this.db.updateTowerRotate(userId, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if ([4, 6].includes(gamer[0].person_id)) {
            if (typeof x === 'number' && typeof y === 'number' && typeof angle === 'number') {
                await this.db.updateTankMotion(userId, x, y, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if (gamer[0].person_id == 5) {
            if (typeof angle === 'number') {
                await this.db.updateCommanderRotate(userId, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if ([1, 2, 8, 9].includes(gamer[0].person_id)) {
            if (typeof x === 'number' && typeof y === 'number' && typeof angle === 'number') {
                await this.db.updateMotion(userId, x, y, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        return true;
    }


    async fire(user_id, x, y, angle) {
        let gamer = await this.db.getGamerAndPersonByUserId(user_id);
        gamer = gamer[0];
        if (!gamer) return true;
        if ([3, 7].includes(gamer.person_id)) {
            await this.tankFire(user_id, gamer, x, y, angle);
        } else if (gamer.person_id === 9) {
            await this.infantryFire(user_id, gamer, x, y, angle, 1);
        } else if (gamer.person_id === 8) {
            await this.infantryFire(user_id, gamer, x, y, angle, 0);
        } else if (gamer.person_id === 1) {
            await this.infantryFire(user_id, gamer, x, y, angle, 0);
        }
        return true;
    }
}

module.exports = GameManager;