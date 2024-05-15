class User {
    constructor({ db, crypto, uuid, socketId }) {
        this.db = db;
        this.crypto = crypto;
        this.uuid = uuid;
        this.socketId = socketId;
        // from DB
        this.id;
        this.nickname;
        this.token;
        //from Lobby
        this.experience;
        this.status = 'l';
        this.roleId;
        this.tankId;
        
        // from Game
        this.status;
        this.reloadTimestamp;
        this.hp;
        this.x;
        this.y;
    }

    get() {
        return {
            nickname: this.nickname,
            token: this.token,
        }
    }

    _includeUserData({ id, nickname }, token) {
        this.id = id;
        this.nickname = nickname;
        this.token = token;
    }

    _includeGamerData({ experience }) {
        this.experience = experience;
        this.status = 'lobby';
    }
 
    async registration(login, nickname, hash) {
        let pattern = /^[A-Za-zА-Яа-я0-9]{6,15}$/; //Выражение для логина
        let pattern1 = /^[A-Za-zА-Яа-я0-9]{3,16}$/; //Выражение для никнейма
        if (pattern.test(login) && pattern1.test(nickname)) {
            const checkUser = await this.db.getUserByLogin(login);
            if (checkUser) {
                return false;
            }
            const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
            await this.db.addUser(login, nickname, hash, token);
            const user = await this.db.getUserByToken(token);
            await this.db.addGamer(user.id);
            
            const gamer = await this.db.getGamerById(user.id);
            this._includeUserData(user, token);
            console.log(gamer)
            this._includeGamerData(gamer);
            return true;
        }
        return false;
    }

    async login(login, hash, rnd) {
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        const user = await this.db.getUserByLogin(login);
        if (user && user.login) {
            const hashS = this.crypto.createHash('sha256').update(user.password + rnd).digest('hex'); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
            if (hash == hashS) {
                await this.db.updateToken(user.id, token);
                const gamer = await this.db.getGamerById(user.id);
                this._includeUserData(user, token);
                this._includeGamerData(gamer);
                return true;
            }
        }
        return false;
    }
    
    async logout(token) {
        if (token === this.token) {
            await this.db.deleteToken(this.id);
            return true;
        }
        return false;
    }

    async tokenVerification(token) {
        const user = await this.db.getUserByToken(token);
        if (token === user.token) {
            const gamer = await this.db.getGamerById(user.id);
            this._includeGamerData(gamer);
            this._includeUserData(user, user.token);
            return true;
        }
        return false;
    }

    suicide() {
        this.x = null;
        this.y = null;
        this.angle = null;
        this.hp = null;
        this.roleId = null;
        this.status = 'l';
    }

    addToGame(roleId) {
        this.x = 5;
        this.y = 5;
        this.angle = 0;
        this.hp = 8;
        this.roleId = roleId;
        this.status = 'a';
    }

    fire() {
        if(Date.now() - this.reloadTimestamp > 100) {
            return true;
        }
        return false;
    }

    updateReloadtimestamp() {
        this.reloadTimestamp = Date.now()
    }

    checkDead() {
        if(this.hp < 0) {
            // Написать код смерти.
            return true;
        }
        return false;
    }

    damage(damage) {
        this.hp -= damage;
    }

    motion(x, y,angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

}

module.exports = User;