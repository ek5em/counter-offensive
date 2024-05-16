class DB {
    constructor() {
        const mysql = require("mysql");
        this.connection = mysql.createConnection({
            host: "MySQL-8.2",
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
        return result[0];
    }

    async queryHandlerAll(query, data) {
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

    async addUser(login, nickname, hash, token) {
        let query = "INSERT INTO users (login, nickname, password, token, tokenLastUse, timeCreate) VALUES(?, ?, ?, ?, NOW(), NOW())";
        await this.queryHandler(query, [login, nickname, hash, token]); 
    }


    async addGamer(userId){
        let query = "INSERT INTO `gamers` (`userId`, `experience`) VALUES (?, 0);";
        await this.queryHandler(query, [userId]); 
    }

    async getGamerById(userId) {
        let query = "SELECT * FROM gamers WHERE userId=?";
        const gamer = await this.queryHandler(query, [userId])
        return gamer;
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

    /* Чат */
    async addMessage(userId, message) {
        let query = "INSERT INTO messages (userId, text, sendTime) VALUES(?, ?, NOW())";
        await this.queryHandler(query, [userId, message]); 
    }


    async getMessages(){
        let query = `SELECT u.id AS userId, u.nickname AS nickname, m.text AS text, r.id AS level, r.name AS rankName, m.sendTime AS sendTime
        FROM messages AS m 
        INNER JOIN users AS u ON m.userId=u.id
        JOIN ranks AS r ON r.id=(SELECT MAX(r.id) as level FROM gamers AS g JOIN ranks as r ON r.experience<=g.experience WHERE g.userId=u.id)
        ORDER BY m.sendTime DESC
        LIMIT 30`;
        return await this.queryHandlerAll(query, []);
    }

    async getBase() {
        let query = "SELECT mobBaseX AS x, mobBaseY AS y, baseRadius AS radius FROM game WHERE id=1";
        return await this.queryHandler(query, [], true);
    }
    
    async getRanks() {
        let query = "SELECT * FROM ranks";
        return await this.queryHandlerAll(query, []);
    }

    async getPersons() {
        let query = "SELECT * FROM persons";
        return await this.queryHandlerAll(query,[]);
    } 

    /* Объекты */
    async getStaticObjects() {
        let query = "SELECT id, type, x, y, sizeX, sizeY, angle, status FROM objects WHERE status in ('s')";
        return await this.queryHandlerAll(query, []);
    }

    async getDynamicObjects() {
        let query = "SELECT id, type, hp, x, y, sizeX, sizeY, angle, status FROM objects WHERE status in('a', 'i')";
        return await this.queryHandlerAll(query, []);
    }
}
module.exports = DB;
