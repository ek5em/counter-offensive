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
        await this.db.addGamer(user.id);
        const rank = await this.db.getRankById(user.id);
        return {
            id: user.id,
            token: token,
            login: login,
            nickname: nickname,
            rank_name: rank.rank_name,
            gamer_exp: rank.gamer_exp,
            next_rang: rank.next_rang,
            level: rank.level
        };
    }

    async login(login, hash, rnd) {
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        const user = await this.db.getUserByLogin(login);
        if(user){
            const hashS = this.crypto.createHash('sha256').update(user.password+rnd).digest('hex'); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
            if(hash == hashS){
                const rank = await this.db.getRankById(user.id);
                await this.db.updateToken(user.id, token);
                return {
                    'id': user.id,
                    'token': token,
                    'login': login,
                    'nickname': user.nickname,
                    'rank_name': rank.rank_name,
                    'gamer_exp': rank.gamer_exp,
                    'next_rang': rank.next_rang,
                    'level': rank.level
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