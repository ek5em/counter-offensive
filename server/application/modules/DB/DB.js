class DB {
    constructor() {
        const mysql = require("mysql");
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "counter_offensive",
            password: null
        });
    }


    async queryHandler(query, data) {
        const promise = new Promise((resolve, reject) => {
            this.connection.query(query, data, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
        let result = await promise;
        return result;
    }
    

 /* Юзер */
    async getUserById(id) {
        let query = "SELECT id, login, password, nickname, token FROM users WHERE id=?";
        return await this.queryHandler(query, [id], true);
        
    }


    async getUserByLogin(login) {
        let query = "SELECT id, login, password, nickname, token FROM users WHERE login = ?";
        return await this.queryHandler(query, [login], true);
    }


    async getUserByToken(token) {   
        let query = "SELECT id, login, password, nickname, token FROM users WHERE token = ?";
        return await this.queryHandler(query, [token], true);
    }


    async updateToken(userId, token) {
        let query = "UPDATE users SET tokenLastUse = NOW(), token = ? WHERE id=?";
        await this.queryHandler(query, [token, userId]);
    }


    async updatePassword(userId, newPassword){
        let query = "UPDATE users SET password = ? WHERE id = ?";
        await this.queryHandler(query, [newPassword, userId]);
    }


    async deleteToken(userId) {
        let query = "UPDATE users SET tokenLastUse = NOW(), token = NULL WHERE id = ?";
        await this.queryHandler(query, [userId]);
    }


    async addUser(login, nickname, hash, token) {
        let query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, NOW(), NOW())";
        await this.queryHandler(query, [login, nickname, hash, token]); 
    }


    async addGamer(userId){
        let query = "INSERT INTO `gamers` (`user_id`, `experience`, `status`) VALUES (?, 0, 'lobby');";
        await this.queryHandler(query, [userId]); 
    }


    async getRankById(userId) {
        let query = `SELECT u.id AS user_id, r.id AS level, r.name AS rank_name, g.experience AS gamer_exp, next_r.experience - g.experience AS next_rang
        FROM gamers g
        JOIN users u ON u.id=g.user_id
        JOIN ranks r ON r.experience<=g.experience
        JOIN ranks next_r ON next_r.id = r.id + 1
        WHERE u.id = ?
        ORDER BY r.id DESC LIMIT 1;`;
        return await this.queryHandler(query, [userId], true);
    }


    async getGamerById(userId) {
        let query = "SELECT * FROM gamers WHERE user_id=?";
        return await this.queryHandler(query, [userId]);
    }


    async getMinPersonLevelById(personId){
        let query = "SELECT level FROM persons WHERE id=?;";
        return await this.queryHandler(query, personId, true);
    }


    /* Чат */
    async addMessage(userId, message) {
        let query = "INSERT INTO messages (userId, text, sendTime) VALUES(?, ?, NOW())";
        await this.queryHandler(query, [userId, message]); 
    }


    async getMessages(){
        let query = `SELECT u.id AS userId, u.nickname AS nickname, m.text AS text, r.id AS level, r.name AS rank_name, m.sendTime AS sendTime
        FROM messages AS m 
        INNER JOIN users AS u ON m.userId=u.id
        JOIN ranks AS r ON r.id=(SELECT MAX(r.id) as level FROM gamers AS g JOIN ranks as r ON r.experience<=g.experience WHERE g.user_id=u.id)
        ORDER BY m.sendTime DESC
        LIMIT 30`;
        return await this.queryHandler(query, []);
    }


    /* Получение и изменения для сцены */
    async updateTimestamp(timestamp) {
        let query = "UPDATE game SET timestamp=? WHERE id=1";
        return await this.queryHandler(query, [timestamp]);
    }


    async getGame() {
        let query = "SELECT *, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) as timer FROM game WHERE id=1";
        return await this.queryHandler(query, [], true);
    }


    async getTime() {
        let query = "SELECT timestamp, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) as timer, timeout, banner_timeout, pBanner_timestamp, mBanner_timestamp FROM game WHERE id=1";
        return await this.queryHandler(query, [], true);
    }


    async getGamerAndPersonByUserId(userId) {
        let query = `SELECT g.reload_timestamp, g.person_id, p.reloadSpeed,
        ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) AS timer
        FROM gamers g
        JOIN persons p ON g.person_id = p.id WHERE user_id=?`;
        return await this.queryHandler(query, userId);
    }


    async updateGamerTimestamp(userId) {
        let query = "UPDATE gamers SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE user_id=?";
        return await this.queryHandler(query, [userId]);
    }


    async updateTankTimestamp(userId) {
        let query = "UPDATE tanks SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE gunner_id=?";
        return await this.queryHandler(query, [userId]);
    }


    async getAllMobs() {
        let query = "SELECT id, person_id, x, y, angle FROM mobs;";
        return await this.queryHandler(query, []);//All
    }


    async getAllBullets() {
        let query = "SELECT type, x2 AS x, y2 AS y, dx, dy FROM bullets";
        return await this.queryHandler(query, []);//All
    }


    async getAllTanks() {
        let query = "SELECT type, x, y, angle, tower_angle FROM tanks";
        return await this.queryHandler(query, []);//All
    }


    async getBullets(){
        let query = "SELECT * FROM bullets";
        return await this.queryHandler(query, []);//All
    }


    async getFootGamers(){
        let query = "SELECT * FROM gamers WHERE status='alive' AND person_id IN (2, 8, 9)";
        return await this.queryHandler(query, []);//All
    }


    async getTanks(){
        let query = "SELECT * FROM tanks";
        return await this.queryHandler(query, []);//All
    }
    

    async updateMotion(user_id, x, y, angle){
        let query= "UPDATE gamers SET x=?, y=?, angle=? WHERE user_id=?;";
        await this.queryHandler(query, [x, y, angle, user_id],true);
    }


    async updateTowerRotate(user_id, angle){
        let query= "UPDATE tanks SET tower_angle=? WHERE gunner_id=?;";
        await this.queryHandler(query, [angle, user_id],true);
    }


    async updateTankMotion(user_id, x, y, angle){
        let query= "UPDATE tanks SET x=?, y=?, angle=? WHERE driver_id=?;";
        await this.queryHandler(query, [x, y, angle, user_id],true);
    }


    async updateCommanderRotate(user_id, angle){
        let query= "UPDATE tanks SET commander_angle=? WHERE commander_id=?;";
        await this.queryHandler(query, [angle, user_id],true);
    }


    /* Обновление хэша*/
    async updateChatHash(hash) {
        let query = "UPDATE game SET chatHash=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateLobbyHash(hash){
        let query = "UPDATE game SET hashLobby=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateGamersHash(hash){
        let query = "UPDATE game SET hashGamers=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateMobsHash(hash){
        let query = "UPDATE game SET hashMobs=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateMapHash(hash){
        let query = "UPDATE game SET hashMap=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateTanksHash(hash){
        let query = "UPDATE game SET hashTanks=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateBulletsHash(hash){
        let query = "UPDATE game SET hashBullets=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    async updateBodiesHash(hash){
        let query = "UPDATE game SET hashBodies=? WHERE id=1";
        await this.queryHandler(query, [hash]);
    }


    /* Убийство */
    async killGamerInHeavyTank(mechId, gunnerId, commId) {
        let query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id IN (?, ?, ?)";
        await this.queryHandler(query,[mechId, gunnerId, commId]);
    }


    async killGamerInMiddleTank(mechId, gunnerId) {
        let query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id IN (?, ?)";
        await this.queryHandler(query,[mechId, gunnerId]);
    }


    async endUserGame(userId) {
        let query = "DELETE FROM tanks WHERE commander_id=? OR gunner_id = ? OR driver_id =?";
        await this.queryHandler(query, [userId, userId, userId]);
    }

    
    async damageGamers(gamers) {
        let cases = [];
        gamers.forEach(gamer => {
            let id = parseInt(gamer.id);
            let hp = parseInt(gamer.hp);
            cases.push(`WHEN ${id} THEN ${hp}`);
        });
    
        let casesString = cases.join(" ");
        let query = `UPDATE gamers SET hp = CASE id ${casesString} ELSE hp END`;
        await this.queryHandler(query, []);
    }
    
    async damageMobs(mobs) {
        let cases = [];
        mobs.forEach(mob => {
            let id = parseInt(mob.id);
            let hp = parseInt(mob.hp);
            cases.push(`WHEN ${id} THEN ${hp}`);
        });
    
        let casesString = cases.join(" ");
        let query = `UPDATE mobs SET hp = CASE id ${casesString} ELSE hp END`;
        await this.queryHandler(query, []);
    }
    


    async deleteTanksById(tanksId){
        let tanksIdString = tanksId.join(" "); 

        let query = `DELETE FROM tanks WHERE id = (${tanksIdString})`;
        await this.queryHandler(query, []);
    }


    async killObjectsById(objectsId){
        let objectsIdString = objectsId.join(" "); 

        let query = `DELETE FROM objects WHERE id in (${objectsIdString})`;
        await this.queryHandler(query, []);
    }


    async deleteMobsById(mobsId){
        let mobsIdString = mobsId.join(" "); 
        
        let query = `DELETE FROM mobs WHERE id in (${mobsIdString})`;
        await this.queryHandler(query, []);
    }


    async killGamersById(gamersId){
        let gamersIdString = gamersId.join(" "); 
        
        let query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id IN (?)";
        await this.queryHandler(query,[gamersIdString]);
    }


    async killGamer(gamerId){
        let query = "UPDATE `gamers` SET status='dead', person_id=-1 WHERE id = ?";
        await this.queryHandler(query,[gamerId]);
    }


    async killObject(objectId){
        let query = "UPDATE objects SET hp=0, status='d' WHERE id=?";
        await this.queryHandler(query, [objectId]);
    }


    async killTank(tankId){
        let query = "DELETE FROM `tanks` WHERE id=?";
        await this.queryHandler(query,[tankId]);
    }


    async killMob(mobId){
        let query = "DELETE FROM `mobs` WHERE id=?";
        await this.queryHandler(query,[mobId]);
    }


    /* Пули */
    async addBullet(user_id, x, y, dx, dy, type){
        let query = "INSERT INTO bullets (user_id, x1, y1, x2, y2, dx, dy, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await this.queryHandler(query, [user_id, x, y, x, y, dx, dy, type]);
    }


    async moveBullets(bullets) {
        let casesX1 = [];
        let casesY1 = [];
        let casesX2 = [];
        let casesY2 = [];
        bullets.forEach(bullet => {
            let id = parseInt(bullet.id);
            let x1 = parseFloat(bullet.x1);
            let y1 = parseFloat(bullet.y1);
            let x2 = parseFloat(bullet.x2);
            let y2 = parseFloat(bullet.y2);
            casesX1.push(`WHEN ${id} THEN ${x1}`);
            casesY1.push(`WHEN ${id} THEN ${y1}`);
            casesX2.push(`WHEN ${id} THEN ${x2}`);
            casesY2.push(`WHEN ${id} THEN ${y2}`);
        });
        
        let casesStringX1 = casesX1.join(" ");
        let casesStringY1 = casesY1.join(" ");
        let casesStringX2 = casesX2.join(" ");
        let casesStringY2 = casesY2.join(" ");
        
        let query = `UPDATE bullets SET 
        x1 = CASE id ${casesStringX1} ELSE x1 END,
        y1 = CASE id ${casesStringY1} ELSE y1 END,
        x2 = CASE id ${casesStringX2} ELSE x2 END,
        y2 = CASE id ${casesStringY2} ELSE y2 END`;
        
        await this.queryHandler(query, []);
    }
    


    async deleteBulletsById(bulletsId){
        let bulletsIdString = bulletsId.join(", ");
        let query = `DELETE FROM bullets WHERE id IN (${bulletsIdString})`;
        await this.queryHandler(query, []);
    }


    async deleteBullet(id){
        let query = "DELETE FROM bullets WHERE id = ?";
        await this.queryHandler(query, [id]);
    }


    /* Уменьшение жизней*/
    async lowerHpGamer(id, newHp){
        let query = "UPDATE gamers SET hp = ? WHERE id = ?";
        await this.queryHandler(query, [newHp, id]);
    }


    async lowerHpTank(id, newHp){
        let query = "UPDATE tanks SET hp = ? WHERE id = ?";
        await this.queryHandler(query, [newHp, id]);
    }


    async lowerHpMob(id, newHp){
        let query = "UPDATE mobs SET hp = ? WHERE id = ?";
        await this.queryHandler(query, [newHp, id]);
    }


    async lowerHpObject(id, newHp){
        let query = "UPDATE objects SET hp = ? WHERE id = ?";
        await this.queryHandler(query, [newHp, id]);
    }


    async damageTanks(tanks){
        let cases = [];
        tanks.forEach(tank => {
            let id = parseInt(tank.id);
            let hp = parseInt(tank.hp);
            cases.push(`WHEN ${id} THEN ${hp}`);
        });

        let casesString = cases.join(" ");
        let query = `UPDATE tanks SET hp = CASE id ${casesString} ELSE hp END`;
        await this.queryHandler(query, []);
    }


    /* Мобы */
    async addMobs(role, x, y, hp) {
        // console.log(role, x, y, hp);
        let query = "INSERT INTO mobs (person_id, hp, x, y, angle, reload_timestamp) VALUES (?, ?, ?, ?, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        await this.queryHandler(query, [role, hp, x, y]);
    }


    async moveMob(mobX, mobY, mobId) {
        let query = "UPDATE mobs SET x=?, y=? WHERE id=?;";
        await this.queryHandler(query, [mobX, mobY, mobId]);
    }


    async rotateMob(angle, mobId) {
        let query = "UPDATE mobs SET angle=? WHERE id=?;";
        await this.queryHandler(query, [angle, mobId]);
    }


    async getMobPath(mobId){
        let query = "SELECT path FROM mobs WHERE id=?";
        return await this.queryHandler(query, [mobId], true);
    }


    async setMobPath(mobId, path){
        let query = "UPDATE mobs SET path=?, path_update=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE id=?";
        await this.queryHandler(query, [path, mobId]);
    }


    async getMobById(mobId){
        let query = "SELECT x, y, angle FROM mobs WHERE id=?";
        return await this.queryHandler(query, [mobId], true);
    }


    async updateMobTimestamp(mobId){
        let query = "UPDATE mobs SET reload_timestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE id=?";
        await this.queryHandler(query, [mobId]);
    }


    async getMobs() {
        let query = `SELECT m.id AS id, m.hp AS hp, m.path_update AS path_update, m.reload_timestamp AS timestamp,
         m.person_id AS personId, m.x AS x, m.y AS y, m.angle AS angle,
        p.reloadSpeed AS reloadSpeed, p.rotateSpeed AS rotateSpeed, p.movementSpeed AS movementSpeed 
        FROM mobs m JOIN persons p ON m.person_id=p.id;`;
        return await this.queryHandler(query, []);
    }


    /* Лобби */

    async createNewTankInLobby(userId, field, tankType) {
        let query = `INSERT INTO tank_lobby (type, ${field}) VALUES (?, ?);`;
        await this.queryHandler(query, [tankType, userId]);
    }

    async setGamerInTankLobby(userId, field, tankId) {
        let query = `UPDATE tank_lobby SET ${field}=? WHERE id=?;`;
        await this.queryHandler(query, [userId, tankId]);
    }

    async deleteGamerInTankLobby(userId) {
        const query = `UPDATE tank_lobby
        SET driver_id = IF(driver_id = ?, NULL, driver_id),
        gunner_id = IF(gunner_id = ?, NULL, gunner_id),
        commander_id = IF(commander_id = ?, NULL, commander_id)
        WHERE driver_id = ? OR gunner_id = ? OR commander_id = ?;`;
        await this.queryHandler(query, [userId, userId, userId, userId, userId, userId]);
    }

    async setGamerRole(userId, role, hp) {
        let query = "UPDATE gamers SET person_id=?, hp=?, status='alive', x=5, y=5, angle=0 WHERE user_id=?;";
        await this.queryHandler(query, [role, hp, userId]); 
    }

    async deleteEmptyTank() {
        let query = "DELETE FROM tank_lobby WHERE driver_id IS NULL AND gunner_id IS NULL AND commander_id IS NULL;";
        await this.queryHandler(query, []);
    }
    
    async getHeavyTank(){
        let query = `SELECT id,
        CASE WHEN driver_id IS NOT NULL THEN 'true' ELSE 'false' END AS Mechanic,
        CASE WHEN gunner_id IS NOT NULL THEN 'true' ELSE 'false' END AS Gunner,
        CASE WHEN commander_id IS NOT NULL THEN 'true' ELSE 'false' END AS Commander
        FROM tank_lobby WHERE type=0;`;
        return await this.queryHandler(query, []);
    }

    async getMiddleTank(){
        let query = `SELECT id,
        CASE WHEN driver_id IS NOT NULL THEN 'true' ELSE 'false' END AS Mechanic,
        CASE WHEN gunner_id IS NOT NULL THEN 'true' ELSE 'false' END AS Gunner
        FROM tank_lobby WHERE type=1;`;
        return await this.queryHandler(query, []);
    }

    async getLobby(){
        let query = "SELECT user_id, person_id, experience FROM gamers WHERE person_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9);";
        return await this.queryHandler(query, []);
    }


    async getTankByUserId(userId) {
        let query = `SELECT id, x, y, angle, hp, tower_angle, commander_angle, commander_id, driver_id, gunner_id FROM tanks
        WHERE commander_id=? OR gunner_id = ? OR driver_id =?`;
        return await this.queryHandler(query, [userId, userId, userId], true);
    }


    async getTankByGunnerId(userId) {
        let query = "SELECT reload_timestamp FROM tanks WHERE gunner_id = ?";
        return await this.queryHandler(query, [userId], true);
    }


    async setStartGameTimestamp(){
        let query = "UPDATE game SET startGameTimestamp=ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) WHERE id=1";
        await this.queryHandler(query, []);
    }


    async getPerson(personId) {
        let query = "SELECT * FROM gamers WHERE person_id=?";
        return await this.queryHandler(query,[personId]);
    }
    
    async checkLiveGamer(){
        let query = "SELECT CASE WHEN EXISTS (SELECT 1 FROM gamers WHERE status='alive') THEN TRUE ELSE FALSE END AS status_exists;";
        return await this.queryHandler(query,[]);
    }


    async deleteRole(personId) {
        let query = "UPDATE gamers SET person_id=-1, status = 'lobby' WHERE person_id = ?";
        await this.queryHandler(query, [personId]);
    }
    

    async addHeavyTank(driverId, gunnerId, commanderId, hp){
        let query = "INSERT INTO tanks (type, driver_id, gunner_id, commander_id, hp, x, y, reload_timestamp) VALUES (1, ?, ?, ?, ?, 5, 5, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        await this.queryHandler(query, [driverId, gunnerId, commanderId, hp]);
    }


    async addMiddleTank(driverId, gunnerId, hp){
        let query = "INSERT INTO tanks (type, driver_id, gunner_id, hp, x, y, reload_timestamp) VALUES (0, ?, ?, ?, 5, 5, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));";
        await this.queryHandler(query, [driverId, gunnerId, hp]);
    }


    async setTank(userId, roleId, tankId){
        let query = "INSERT INTO tank_lobby (person_id, user_id, tank_id) VALUES (?, ?, ?)";
        await this.queryHandler(query, [roleId, userId, tankId]);
    }


   async getTankInLobbyById(tankId){
        let query = "SELECT * FROM tank_lobby WHERE id=?";
        return await this.queryHandler(query, [tankId]);//All
    }


    // async deleteGamerInTankLobby(userId){
    //     let query = "UPDATE tank_lobby SET  WHERE user_id = ?";
    //     await this.queryHandler(query, [userId]);
    // }


    async getPersons() {
        let query = `SELECT p.id AS person_id, p.name AS name, p.level as level, r.experience AS exp 
        FROM persons p
        JOIN ranks r ON p.level = r.id`;
        return await this.queryHandler(query, []);//All
    }

    async getPersonParamsById(personId) {
        let query = "SELECT * FROM persons WHERE id=?";
        return await this.queryHandler(query,[personId]);
    }

    async getTankmans(){
        let query = "SELECT person_id, user_id, tank_id FROM tank_lobby;";
        return await this.queryHandler(query, []);//All
    }


    async deleteTank(tankId){
        console.log(tankId, 'sdfsdf')
        let query = "DELETE FROM tank_lobby WHERE id = ?";
        await this.queryHandler(query, [tankId]);
    }


    async getGamers() {
        let query = "SELECT person_id, x, y, angle  FROM gamers WHERE person_id IN (1, 2, 8, 9) AND status='alive'";
        return await this.queryHandler(query, []);//All
    }


    async getGamerStatus(userId) {
        let query = "SELECT status, person_id FROM gamers WHERE id=?";
        return await this.queryHandler(query, [userId]);
    }


    async suicide(userId) {
        let query = "UPDATE gamers SET person_id=-1, status='lobby' WHERE user_id = ?";
        await this.queryHandler(query, [userId]);
    }


    async tankExit(userId) {
        let query = "DELETE FROM tank_lobby WHERE user_id = ?";
        await this.queryHandler(query, [userId]);
    }


    async endTankGame(tankId){
        let query = "DELETE FROM tanks WHERE id = ?";
        await this.queryHandler(query, [tankId]);
    }


    /* Трупы */
    async setGamerBodies(x, y, angle, type){
        let query = "INSERT INTO bodies (x, y, angle, type) VALUES (?, ?, ?, ?)";
        await this.queryHandler(query, [x, y, angle, type]);
    }


    async setMobBodies(x, y, angle, type){
        let query = "INSERT INTO bodies (x, y, angle, type, isMob) VALUES (?, ?, ?, ?, TRUE)";
        await this.queryHandler(query, [x, y, angle, type]);
    }


    async getBodies(){
        let query = "SELECT x, y, angle, type, isMob FROM bodies";
        return await this.queryHandler(query, []);//All
    }


    async setBodies(bodies){
        let cases = [];
        bodies.forEach(body => {
            let x = parseFloat(body.x);
            let y = parseFloat(body.y);
            let angle = parseFloat(body.angle);
            let type = parseInt(body.type);
            let isMob = parseInt(body.isMob);
            cases.push(`(${x}, ${y}, ${angle}, ${type}, ${isMob})`);
        });
    
        let casesString = cases.join(", ");
    
        let query = `INSERT INTO bodies (x, y, angle, type, isMob) VALUES ${casesString}`;
        await this.queryHandler(query, []);
    }


    /*Знаменосец*/
    async getBannerman(){
        let query = `SELECT ga.x AS x, ga.y AS y, g.mobBase_x AS mobBaseX, g.mobBase_y AS mobBaseY,
        g.base_radius AS baseRadius
        FROM game g JOIN gamers ga ON ga.person_id=2`;
        return await this.queryHandler(query, []);
    }


    async getMobBannerman(){
        let query = `SELECT m.x AS x, m.y AS y, g.mobBase_x AS mobBaseX, g.mobBase_y AS mobeBaseY,
        g.playersBase_x AS playerBaseX, g.playersBase_y AS playersBaseY, g.base_radius AS baseRadius
        FROM game g JOIN mobs m ON m.person_id=2`;
        return await this.queryHandler(query, []);
    }


    async getBannermanTime() {
        let query = "SELECT banner_timestamp, NOW()+ 0 as nowTime, banner_timeout FROM game WHERE id=1";
        return await this.queryHandler(query, []);
    }


    async updatePlayerBannermanTimestamp(timestamp) {
        let query = "UPDATE game SET pBanner_timestamp=? WHERE id=1";
        return await this.queryHandler(query, [timestamp]);
    }


    async updateMobBannermanTimestamp(timestamp) {
        let query = "UPDATE game SET mBanner_timestamp=? WHERE id=1";
        return await this.queryHandler(query, [timestamp]);
    }


    async getMobPerson(personId){
        let query = "SELECT * FROM mobs WHERE person_id=? ;";
        return await this.queryHandler(query,[personId]);
    }


    /* Объекты */
    async getObjects() {
        let query = "SELECT type, x, y, sizeX, sizeY, angle FROM objects WHERE status in ('a', 'i')";
        return await this.queryHandler(query, []);
    }


    async getAllObjects() {
        let query = "SELECT id, hp, x, y, sizeX, sizeY, status FROM objects WHERE status in('a', 'i')";
        return await this.queryHandler(query, []);
    }


    async deleteObject(objectId) {
        let query = "UPDATE objects SET hp = 0, status='d' WHERE id = ?";
        await this.queryHandler(query, [objectId]);
    }


    async updateObjectHp(id, newHp) {
        let query = "UPDATE objects SET hp = ? WHERE id = ?";
        await this.queryHandler(query, [newHp, id]);
    }


    async damageObjects(objects){
        let cases = [];
        objects.forEach(object => {
            let id = parseInt(object.id);
            let hp = parseInt(object.hp);
            cases.push(`WHEN ${id} THEN ${hp}`);
        });

        let casesString = cases.join(" ");
        let query = `UPDATE objects SET hp = CASE id ${casesString} ELSE hp END`;
        await this.queryHandler(query, []);
    }


    /* Очистка игры*/
    async deleteBodies() {
        let query = "TRUNCATE TABLE bodies";
        await this.queryHandler(query, []);
    }


    async deleteBullets() {
        let query = "TRUNCATE TABLE bullets;";
        await this.queryHandler(query, []);
    }
    

    async deleteTanks() {
        let query = "TRUNCATE TABLE tanks;";
        await this.queryHandler(query, []);
    }


    async deleteMobs() {
        let query = "TRUNCATE TABLE mobs;";
        await this.queryHandler(query, []);
    }


    async setWinners() {
        let query = "UPDATE `gamers` SET status='w', person_id=-1, hp=0 WHERE status='alive'";
        await this.queryHandler(query, []);
    }


    async updateObjectsHp() {
        let query = "UPDATE `objects` SET status='a', hp=100 WHERE status='d'";
        await this.queryHandler(query, []);
    }


    async updateExp(updateExp){
        let cases = [];
        updateExp.forEach(oneExp => {
            let id = parseInt(oneExp.id);
            let exp = parseInt(oneExp.exp);
            cases.push(`WHEN ${id} THEN experience + ${exp}`);
        });

        let casesString = cases.join(" ");
        let query = `UPDATE gamers SET experience = CASE id ${casesString} ELSE hp END`;
        await this.queryHandler(query, []);
    }


    async updateOneExp(exp, userId){
        let query = "UPDATE gamers SET experience = experience + ? WHERE id=?";
        await this.queryHandler(query, [exp, userId]);
    }


    async addBannermanExp(exp) {
        let query = "UPDATE gamers SET experience = experience + ? WHERE person_id=2";
        await this.queryHandler(query, [exp]);
    }


    async addWinnerExp(exp) {
        let query = "UPDATE gamers SET experience = experience + ? WHERE status='a'";
        await this.queryHandler(query, [exp]);
    }
}
module.exports = DB;
