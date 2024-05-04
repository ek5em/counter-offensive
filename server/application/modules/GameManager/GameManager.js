const { log } = require('console');
const BaseModule = require('../BaseModule/BaseModule');

class GameManager{
    constructor(db){
        // super(s);
        this.db = db;
        this.crypto = require('crypto');
        this.uuid = require('uuid');
        const easystarjs = require('easystarjs');
        this.easystar = new easystarjs.js();
        const GameMath = require('./GameMath');
        
        this.gameMath = new GameMath();
        this.hashFlagGamers; // Флаг изменения состояния игроков 
        this.hashFlagBullets; // Флаг изменения состояния пуль
        this.hashFlagBodies; // Флаг изменения состояния тел
        this.hashFlagMobs; // Флаг изменения состояния мобов
        this.hashFlagMap; // Флаг изменения состояния карты
        this.recreateFlagMap; // Флаг пересоздани   
        this.mobs;
        this.gamers;  
        this.tanks;
        this.game;
        this.objects;
        this.bullets;
        this.winer;
        this.checkEnd;
        this.lowerGamersHpArr = []; 
        this.lowerMobsHpArr = [];
        this.lowerTanksHpArr = [];
        this.lowerObjectsHpArr = [];
        this.deleteBulletsArr = [];
        this.moveBulletsArr = [];
        this.updateExpArr = [];
        this.map;
        this.gameMath;
    }

    async tankFire(user_id, gamer, x, y, angle){
        let tank = await this.db.getTankByGunnerId(user_id);
        if(tank[0] && (gamer.timer - tank[0].reload_timestamp)>(gamer.reloadSpeed * 1000)){
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);
            await this.db.addBullet(user_id, x+dx, y+dy, dx, dy, 1);
            await this.db.updateTankTimestamp(user_id);
            await this.db.updateBulletsHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
        }
    }
    
    // Выстрел 
    async infantryFire(user_id, gamer, x, y, angle, bulletType){
        if(gamer && (gamer.timer - gamer.reload_timestamp)>(gamer.reloadSpeed * 1000)){
            let dx = Math.cos(angle);
            let dy = Math.sin(angle);
            await this.db.addBullet(user_id, x+0.3*dx, y+0.3*dy, dx, dy, bulletType);
            await this.db.updateGamerTimestamp(user_id);
            await this.db.updateBulletsHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
        }
    }
    
    /*Map*/
    checkMap() {
        if(!this.map || this.recreateFlagMap) this.fillMap();
    }
    
    fillMap() {
        // Заполнение карты
        this.map = [];
        let grid;

        // Алгоритм не хочет работать с прямоугольной картой. Проблем с таким способом создания квадратной не возникает
        this.map = Array.from({ length: 151 }, () => Array.from({ length: 151 }, () => 0));
        grid = Array.from({ length: 151 }, () => Array.from({ length: 151 }, () => 0));
        this.objects.forEach(object => {
            for (let i = object.x; i < object.x + object.sizeX + 1; i++) {
                for (let j = object.y; j < object.y + object.sizeY + 1; j++) {
                    this.map[i][j] = 1;
                    grid[j][i] = 1;
                }
            }
        });
        this.recreateFlagMap = false; 
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles([0]);
    }

/* Mobs */

    generatePointWithoutObject (x1, x2, y1, y2) {
        let xs = Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
        let ys = Math.floor(Math.random() * (y2 - y1 + 1)) + y1;

        if(this.map[xs][ys] === 0){
            return [xs, ys];
        }
        else return this.generatePointWithoutObject(x1, x2, y1, y2);
    }

    async addSquad(params) {
        let mobsCounter = 0;
        for(let mob of this.mobs) {
            if(mob.x > params[0] && mob.x < params[1] && mob.y > params[2] && mob.y < params[3])
                mobsCounter++;
        }
        if(mobsCounter < params[8]){
            for(let i = mobsCounter; i < params[8]; i++){
                let point = this.generatePointWithoutObject(params[4], params[5], params[6], params[7]);       
                // Оптимизировать на отправку мобов массивами
                await this.db.addMobs(Math.floor(Math.random() * (9 - 8 + 1)) + 8, point[0], point[1], 8);
            }
            this.hashFlagMobs = true;
        }
    }
    

    async addMobs() {
        let mobsCount = this.mobs.length;
        let gamerCount = 3 * this.gamers.length + 4 * this.tanks.length;
        
        // Максимальное количество мобов
        let allMobsCount = gamerCount + 32
        
        // Проверяю изменилось ли количество мобов на всей карте
        if(mobsCount >= allMobsCount) return;

        // Координаты отрядов мобов
        let coords = [[90, 140, 70, 115, 110, 140, 95, 115, 4],
        [45, 90, 85, 115, 55, 85, 86, 110, 4], 
        [30, 95, 55, 85, 40, 90, 60, 80, 4], 
        [96, 124, 14, 75, 100, 117, 22, 70, 4], 
        [125, 145, 50, 80, 130, 145, 58, 75, 4], 
        [65, 95, 5, 30, 70, 90, 5, 40, 4], 
        [5, 30, 55, 95, 5, 20, 60, 90, 4],
        [20, 70, 30, 55, 30, 60, 35, 50, 4]];

        for(let coord of coords) {
            await this.addSquad(coord);
        }
    }
    


    async mobFire(x, y, angle, personId){
        let dx = Math.cos(angle);
        let dy = Math.sin(angle);
        let bulletType = personId === 9 ? 1 : 0;
        await this.db.addBullet(-1, x + dx, y + dy, dx, dy, bulletType);
        this.hashFlagBullets = true;
    }

    findTargetGamer(mob) {
        let targetDistance = 1000;
        let target;
        let allGamers = this.gamers.concat(this.tanks);
        
        allGamers.forEach(gamer => {
            // Дистанция до игрока
            let distance = this.gameMath.calculateDistance(mob.x, gamer.x, mob.y, gamer.y);
            if(distance < targetDistance) { 
                target = {distance: distance, x: gamer.x, y: gamer.y} 
            }
        })
        if(target) return target;
    }
    

    async mobAction(mob, angle){
        if (this.game.timer - mob.timestamp > mob.reloadSpeed * 1000){
            this.mobFire(mob.x, mob.y, angle, mob.personId);  
            await this.db.rotateMob(angle, mob.id);   
            await this.db.updateMobTimestamp(mob.id); 
        }
    }

    async moveMobs() {
        if(this.gamers.length===0 && this.tanks.length===0) 
            return 0

        for(let mob of this.mobs) {
            let path = [];
            // Проверка необходимости обновления пути моба
            if((this.game.timer - mob.path_update > 1000) || mob.path == []){

                // Поиск целевого игрока
                let targetGamer = this.findTargetGamer(mob);
                if(targetGamer && targetGamer.distance<25){
                    
                    //Угол поворота до целевого игрока
                    let angle = this.gameMath.calculateAngle(targetGamer.x, targetGamer.y, mob.x, mob.y);
                    await this.mobAction(mob, angle);

                    // Случай когда моб находится около своей цели и не идет дальше
                    if((mob.personId === 9 && targetGamer.distance < 4) || (mob.personId === 8 && targetGamer.distance < 2)){
                        continue;
                    }
                    
                    // Моб ищет путь до своей цели
                    this.easystar.findPath(Math.ceil(mob.x), Math.ceil(mob.y), Math.ceil(targetGamer.x), Math.ceil(targetGamer.y), async (mobPath) => {
                        if(mobPath){
                            console.log(JSON.stringify(path));
                            await this.db.setMobPath(mob.id, JSON.stringify(path));
                        } 
                    });
                    this.easystar.calculate();

                }
                // Моб находится далеко от цели
                else continue;                
            }
            // Действие пути у моба еще активно
            else {
                path = await this.db.getMobPath(mob.id);
                path=JSON.parse(path[0].path)
                // Проверка наличия пути 
                if(path){
                    if(path && path.length > 0) {
                        let targetCoord = path[path.length - 1];
                        let angle = this.gameMath.calculateAngle(targetCoord.x, targetCoord.y, mob.x, mob.y);
                        await this.mobAction(mob, angle);
                    
                    } else continue;

                } else continue;
            } 
            if(path[1]){
                // Дистанция пройденная за один рендер
                let distance = mob.movementSpeed * (this.game.timeout / 1000);
                distance = distance > 1 ? 1 : distance;
                let distanceToNextCell = this.gameMath.calculateDistance(mob.x, path[1].x, mob.y, path[1].y);            
                let newDistance = distance - distanceToNextCell;
                let newCoords;
                if(newDistance > 0){
                    newCoords = this.gameMath.calculateShiftPoint(path[1].x, path[1].y, path[2].x, path[2].y, newDistance);
                }
                else{
                    newCoords = this.gameMath.calculateShiftPoint(mob.x, mob.y, path[1].x, path[1].y, distance);    
                }
                
                await this.db.moveMob(newCoords[0], newCoords[1], mob.id);
                this.hashFlagMobs = true;

            }
        }
    }
    

/* Пули */t

    moveBullets() {
        if (!this.bullets){
            return;
        }
        for(let bullet of this.bullets){
            this.moveBullet(bullet.id, bullet.x2, bullet.y2, bullet.dx, bullet.dy);
        }
        this.hashFlagBullets = true;
    }


    async moveBullet(id, x, y, dx, dy) {
        if (x >= 150 || x <= 0 || y >= 120 || y <= 0){
            this.deleteBulletsArr.push(id);
        } else {
            let x2 = x + dx;
            let y2 = y + dy;
            this.moveBulletsArr.push({id: id, x1: x, y1: y, x2: x2, y2: y2});
        }
    }
    

    async shootRegs() {
        if (!this.bullets){
            return 0;
        }
        for(let bullet of this.bullets){
            let currentHp = 0;
            let damage = bullet.type == 0 ? 2 : 50; // Determine damage based on bullet type
            let shootFlag = false;
            for(let gamer of this.gamers){
                if(bullet.user_id != gamer.id && gamer.hp > 0){
                    let range = this.gameMath.shootReg(gamer.x, gamer.y, bullet.x1, bullet.y1, bullet.x2, bullet.y2, 0.2);
                    if(range){
                        currentHp = gamer.hp - damage;
                        this.lowerGamersHpArr.push({id: gamer.id, hp: currentHp});
                        this.deleteBulletsArr.push(bullet.id);
                        shootFlag = true;
                        if(currentHp <= 0 && bullet.user_id != -1){
                            this.updateExpArr.push({id: bullet.user_id, exp: -5});
                        }
                        break;
                    }
                }
            }
            if(!shootFlag){
                for(let tank of this.tanks){
                    let range = this.gameMath.shootReg(tank.x, tank.y, bullet.x1, bullet.y1, bullet.x2, bullet.y2, 0.5);
                    if(range){
                        currentHp = tank.hp - damage;
                        this.lowerTanksHpArr.push({id: tank.id, hp: currentHp});
                        this.deleteBulletsArr.push(bullet.id);
                        shootFlag = true;
                        if(currentHp <= 0 && bullet.user_id != -1){
                            this.updateExpArr.push({id: bullet.user_id, exp: -5});
                        }
                        break;
                    }
                }
            }
            
            if(!shootFlag){
                for(let mob of this.mobs){
                    let range = this.gameMath.shootReg(mob.x, mob.y, bullet.x1, bullet.y1, bullet.x2, bullet.y2, 0.2);
                    if(range){
                        currentHp = mob.hp - damage;
                        this.lowerMobsHpArr.push({id: mob.id, hp: currentHp});
                        this.deleteBulletsArr.push(bullet.id);
                        shootFlag = true;
                        if(currentHp <= 0 && bullet.user_id != -1){
                            this.updateExpArr.push({id: bullet.user_id, exp: 10});
                        }
                        break;
                    }
                }
            }
            if(!shootFlag){
                for(let object of this.objects){
                    if((bullet.x2 >= object.x && bullet.x2 <= object.x + object.sizeX) && (bullet.y2 >= object.y && bullet.y2 <= object.y + object.sizeY)){
                        if(object.status != 'i'){ // Check for destructibility of the object, i - indestructible
                            this.lowerObjectsHpArr.push({id: object.id, hp: object.hp - damage});
                        }
                        this.deleteBulletsArr.push(bullet.id);
                        shootFlag = true;                
                        break;
                    }
                }
            }
        }
    }
    

/* Удаление мертвецов */

    async checkDead() {
        let deleteGamers = [];
        let deleteMobs = [];
        let deleteObjects = [];
        let bodies = [];
        for(let gamer of this.gamers){
            if(gamer.hp <= 0){
                deleteGamers.push(gamer.id);      
                bodies.push({x: gamer.x, y: gamer.y, angle: gamer.angle, type: 0, isMob: 0});
            }
        }
        for(let mob of this.mobs){
            if(mob.hp <= 0){ 
                deleteMobs.push(mob.id);      
                bodies.push({x: mob.x, y: mob.y, angle: mob.angle, type: 0, isMob: 1});
            }
        }
        for(let tank of this.tanks){
            if(tank.hp <= 0){
                this.db.killTank(tank.id);
                if(tank.commander_id) {
                    this.db.killGamerInHeavyTank(tank.driver_id, tank.gunner_id, tank.commander_id);
                    bodies.push({x: tank.x, y: tank.y, angle: tank.angle, type: 1, isMob: 0});
                    bodies.push({x: tank.x, y: tank.y, angle: tank.tower_angle, type: 3, isMob: 0});
                }
                else { 
                    this.db.killGamerInMiddleTank(tank.driver_id, tank.gunner_id); 
                    bodies.push({x: tank.x, y: tank.y, angle: tank.angle, type: 1, isMob: 0});
                    bodies.push({x: tank.x, y: tank.y, angle: tank.tower_angle, type: 4, isMob: 0});
                }
                this.hashFlagGamers = true;
            }
        }
        for(let object of this.objects){
            if(object.hp <= 0){
                deleteObjects.push(object.id);      
            }
        }

        if(deleteGamers.length){
            deleteGamers.length === 1 ? await this.db.killGamer(deleteGamers[0]) : await this.db.killGamersById(deleteGamers);
            this.hashFlagGamers = true;
        }
        if(deleteObjects.length){
            deleteObjects.length === 1 ? await this.db.killObject(deleteObjects[0]) : await this.db.killObjectsById(deleteObjects);
            this.recreateFlagMap = true
            this.hashFlagMap = true;
        }
        if(deleteMobs.length){
            deleteMobs.length === 1 ? await this.db.killMob(deleteMobs[0]) : await this.db.deleteMobsById(deleteMobs);
            this.hashFlagMobs = true;
        }
        if(bodies.length){
            await this.db.setBodies(bodies);
            this.hashFlagBodies = true;
        }
    }


/* Конец игры */

async playerBannermanInZone() {
    let bannerman = await this.db.getBannerman();
    bannerman = bannerman[0];
    if (!bannerman){
        if (this.game.pBanner_timestamp != 0){
            await this.db.updatePlayerBannermanTimestamp(0);
            this.game.pBanner_timestamp = 0;
        }
        return false;
    }
    let dist = this.gameMath.calculateDistance(bannerman.x, bannerman.mobBaseX, bannerman.y, bannerman.mobBaseY);
    if(dist <= bannerman.baseRadius){
        if(this.game.pBanner_timestamp == 0){
            await this.db.updatePlayerBannermanTimestamp(this.game.timer); 
            this.game.pBanner_timestamp = this.game.timer;
        }
        return true;
    }
    if (this.game.pBanner_timestamp != 0){
        await this.db.updatePlayerBannermanTimestamp(0);
        this.game.pBanner_timestamp = 0;
    }
    return false;
}


    async endGame(){
        let player = await this.playerBannermanInZone();
        if(player){
            if(this.game.timer - this.game.pBanner_timestamp >= this.game.banner_timeout){
                await this.db.deleteBodies();
                await this.db.deleteBullets();
                await this.db.addBannermanExp(400);
                await this.db.addWinnerExp(200);
                await this.db.deleteTanks();
                await this.db.deleteMobs();
                await this.db.setWinners();
                await this.db.updateObjectsHp();
            }
        } 
    }

/* Обновление хешей */

    async hashUpdate() {
        let hash = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        if (this.hashFlagGamers){
            await this.db.updateGamersHash(hash);
            this.hashFlagGamers = false;
        }
        if (this.hashFlagBullets){
            await this.db.updateBulletsHash(hash);
            this.hashFlagBullets = false;
        }
        if (this.hashFlagBodies){
            await this.db.updateBodiesHash(hash);
            this.hashFlagBodies = false;
        }
        if (this.hashFlagMobs){
            await this.db.updateMobsHash(hash);
            this.hashFlagMobs = false;
        }
        if (this.hashFlagMap){
            await this.db.updateMapHash(hash);
            this.hashFlagMap = false;
        }
    }


/*  Обновление данных */
    async lowerGamersHp() {
        if(this.lowerGamersHpArr.length > 0) await this.db.damageGamers(this.lowerGamersHpArr);
        this.lowerGamersHpArr = [];
    }

    async lowerObjectsHp() {
        if(this.lowerObjectsHpArr.length > 0){
            await this.db.damageObjects(this.lowerObjectsHpArr);
            this.objects = await this.db.getAllObjects();
            this.recreateFlagMap = true;
            this.lowerObjectsHpArr = [];
        }
            
    }

    async lowerTanksHp() {
        if(this.lowerTanksHpArr.length > 0){
            await this.db.damageTanks(this.lowerTanksHpArr);
            this.lowerTanksHpArr = [];
        }
    }

    async lowerMobsHp() {
        if(this.lowerMobsHpArr.length > 0){
            await this.db.damageMobs(this.lowerMobsHpArr);
            this.lowerMobsHpArr = [];
        }
    }

    async updateBullets() {
        if(this.moveBulletsArr.length > 0) await this.db.moveBullets(this.moveBulletsArr);
        this.moveBulletsArr = [];
    }

    async deleteBullets() {
        if(this.deleteBulletsArr.length > 0){
            this.deleteBulletsArr.length === 1 ? await this.db.deleteBullet(this.deleteBulletsArr[0]) : await this.db.deleteBulletsById(this.deleteBulletsArr);
            this.deleteBulletsArr = [];
        }
    }

    async updateExp() {
        if(this.updateExpArr.length){
            this.updateExpArr.length === 1 ? await this.db.updateOneExp(this.updateExpArr[0].exp, this.updateExpArr[0].id) : await this.db.updateExp(this.updateExpArr);
            this.updateExpArr = [];
        }
    }

/* Получение данных */

    async getGamers() {
        return await this.db.getGamers();
    }

    async getMobs() {
        return await this.db.getAllMobs();
    }

    async getBullets() {
        return await this.db.getAllBullets();
    }

    async getObjects() {
        return await this.db.getObjects();
    }

    async getTanks() {
        return await this.db.getAllTanks();
    }

    async getBodies() {
        return await this.db.getBodies();
    }


// Обновление сцены

    async updateScene(){
        this.bullets = await this.db.getBullets();
        this.gamers = await this.db.getFootGamers(); 
        this.mobs = await this.db.getMobs(); 
        this.tanks = await this.db.getTanks();
        this.objects = await this.db.getAllObjects();
        // Мобы
        this.checkMap();
        await this.addMobs();
        await this.moveMobs();
        // Пули
        this.moveBullets();
        await this.shootRegs();
        await this.updateBullets();
        await this.deleteBullets();
        // Понижение хп
        await this.lowerObjectsHp();
        await this.lowerGamersHp();
        await this.lowerTanksHp();
        await this.lowerMobsHp();
        await this.updateExp();
        // Проверка знаменосца
        await this.endGame();
        // Смерть сущности
        await this.checkDead();
        // Обновление хешей
        await this.hashUpdate();
        
    }

    async update() {
        if (this.game.timer - this.game.timestamp >= this.game.timeout)
            await this.db.updateTimestamp(this.game.timer);
            await this.updateScene();
        }

    async getScene(userId, hashGamers, hashMobs, hashBullets, hashMap, hashBodies) { 
        let gamer = await this.db.getGamerById(userId);
        let result = {};
        this.game = await this.db.getGame();
        this.game = this.game[0];
    
        if(["dead", "lobby"].includes(gamer[0].status)){
            result.is_dead = true;
        }
    
        if(gamer[0].status == "w"){
            result.is_end = 'true';
        } else await this.update();
    
        result.gametime = this.game.timer - this.game.startGameTimestamp;
    
        if([1, 2, 8, 9].includes(gamer[0].person_id)){
            result.gamer = {
                'person_id': gamer[0].person_id,
                'x': gamer[0].x,
                'y': gamer[0].y,
                'angle': gamer[0].angle,
                'hp': gamer[0].hp
            };
        } else{
            let tank = await this.db.getTankByUserId(userId);
            if(tank[0] && [3, 4, 5, 6, 7].includes(gamer[0].person_id)){
                result.gamer = {
                    'person_id': gamer[0].person_id,
                    'x': tank[0].x,
                    'y': tank[0].y,
                    'angle': tank[0].angle,
                    'tower_angle': tank[0].tower_angle,
                    'hp': tank[0].hp
                };
            } else result.gamer = null;
        }
        
        if (this.game.hashGamers !== hashGamers) {
            result.gamers = await this.getGamers();
            result.tanks = await this.getTanks();
            result.hashGamers = this.game.hashGamers;
        }
        
        if (this.game.hashMobs !== hashMobs) {
            result.mobs = await this.getMobs();
            result.hashMobs = this.game.hashMobs;
        }
        
        if (this.game.hashBullets !== hashBullets) {
            result.bullets = await this.getBullets();
            result.hashBullets = this.game.hashBullets;
        }
    
        if (this.game.hashMap !== hashMap) {
            result.mobBase = {
                x: this.game.mobBase_x,
                y: this.game.mobBase_y,
                radius: this.game.base_radius
            };
            result.map = await this.getObjects();
            result.hashMap = this.game.hashMap;
        }
    
        if (this.game.hashBodies !== hashBodies) {
            result.bodies = await this.getBodies();
            result.hashBodies = this.game.hashBodies;
        }
        return result;
    }
    

    async motion(userId, x, y, angle) {
        let gamer = await this.db.getGamerById(userId);
    
        if(!gamer[0]) return true;
        
        if([3, 7].includes(gamer[0].person_id)){
            if (typeof angle === 'number') {
                await this.db.updateTowerRotate(userId, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if([4, 6].includes(gamer[0].person_id)){
            if (typeof x === 'number' && typeof y === 'number' && typeof angle === 'number') {
                await this.db.updateTankMotion(userId, x, y, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if(gamer[0].person_id == 5){
            if (typeof angle === 'number') {
                await this.db.updateCommanderRotate(userId, angle);
                await this.db.updateGamersHash(this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex'));
            } else return 422;
        }
        else if([1, 2, 8, 9].includes(gamer[0].person_id)) {
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
        console.log(gamer);
        if(!gamer) return true;
        if([3, 7].includes(gamer.person_id)) {
            await this.tankFire(user_id, gamer, x, y, angle);
        } else if(gamer.person_id === 9) {
            await this.infantryFire(user_id, gamer, x, y, angle, 1);
        } else if(gamer.person_id === 8) {
            await this.infantryFire(user_id, gamer, x, y, angle, 0);
        } else if(gamer.person_id === 1) {
            await this.infantryFire(user_id, gamer, x, y, angle, 0);
        }
        return true;
    }
}

module.exports = GameManager;