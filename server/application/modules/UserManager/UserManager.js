class UserManager {
    constructor(db){
        this.db = db;
        this.crypto = require('crypto');
        this.uuid = require('uuid');
    }

    async registration(login, nickname, password){
        const checkUser = await this.db.getUserByLogin(login);
        if(checkUser.length !== 0) return 460;
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        await this.db.addUser(login, nickname, password, token); 
        const user = await this.db.getUserByToken(token);
        await this.db.addGamer(user[0].id);
        const rank = await this.db.getRankById(user[0].id);
        return {
            id: user[0].id,
            token: token,
            login: login,
            nickname: nickname,
            rank_name: rank[0].rank_name,
            gamer_exp: rank[0].gamer_exp,
            next_rang: rank[0].next_rang,
            level: rank[0].level
        };
    }

    async login(login, hash, rnd) {
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        const user = await this.db.getUserByLogin(login);
        if(user[0] && user[0].login){
            const hashS = this.crypto.createHash('sha256').update(user[0].password+rnd).digest('hex'); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
            if(hash == hashS){
                const rank = await this.db.getRankById(user[0].id);
                await this.db.updateToken(user[0].id, token);
                console.log(rank);
                console.log(user);
                return {
                    'id': user[0].id,
                    'token': token,
                    'login': login,
                    'nickname': user[0].nickname,
                    'rank_name': rank[0].rank_name,
                    'gamer_exp': rank[0].gamer_exp,
                    'next_rang': rank[0].next_rang,
                    'level': rank[0].level
                };
            }
            return 403;
        }
        return 461;
    }
    

    async logout(userId){
        await this.db.deleteToken(userId);
        return true;
    }


    async updatePassword(token, hash){
        let user = await this.db.getUserByToken(token);
        await this.db.updateToken(user.id, token);
        await this.db.updatePassword(user.id, hash);
        return true;
    }

    async getUser(token){
        return await this.db.getUserByToken(token);
    }
}

module.exports = UserManager;