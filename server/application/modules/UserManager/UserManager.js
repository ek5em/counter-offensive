const BaseModule = require('../BaseModule/BaseModule');
const { SOCKETS } = require("../../../config.js");

class UserManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);
        const { GET_USER } = Mediator.getTriggerTypes();

        this.Mediator.set(GET_USER, async (token) => {
            return await this.db.getUserByToken(token);
        });

        if (!this.io) {
            return;
        }

        io.on('connection', (socket) => {
            socket.on(SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            socket.on(SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(SOCKETS.LOGOUT, (data) => this.logout(data, socket));
            socket.on(SOCKETS.UPDATE_PASSWORD, (data) => this.updatePassword(data, socket));
            socket.on(SOCKETS.TOKEN_VERIFICATION, (data) => this.tokenVerification(data, socket));
            socket.on('disconnect', () => console.log('disconnect', socket.id));
        });


    }

    async registration({login, nickname, password}, socket) {
        let pattern = /^[A-Za-zА-Яа-я0-9]{6,15}$/; //Выражение для логина
        let pattern1 = /^[A-Za-zА-Яа-я0-9]{3,16}$/; //Выражение для никнейма
        if (pattern.test(login) && pattern1.test(nickname)) {
            const checkUser = await this.db.getUserByLogin(login);
            if (checkUser.length !== 0) socket.emit(SOCKETS.REGISTRATION, 460);
            const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
            await this.db.addUser(login, nickname, password, token);
            socket.emit(SOCKETS.REGISTRATION, {
                token: token,
            });      
        }
        else socket.emit(SOCKETS.REGISTRATION, 413);
        
    }

    async login({login, hash, rnd}, socket) {
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        const user = await this.db.getUserByLogin(login);
        if (user[0] && user[0].login) {
            const hashS = this.crypto.createHash('sha256').update(user[0].password + rnd).digest('hex'); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
            if (hash == hashS) {
                await this.db.updateToken(user[0].id, token);
                socket.emit(SOCKETS.LOGIN, {
                    token: token,
                });
            }
            socket.emit(SOCKETS.LOGIN, 403);;
        }
        socket.emit(SOCKETS.LOGIN, 461);
    }


    async logout({userId}, socket) {
        const user = await this.getUser(token);
        if (user[0] && user[0].token != null) {
            await this.db.deleteToken(userId);
            socket.emit(SOCKETS.LOGOUT, true);
        }
        else res.json(answer.bad(413));
        await this.db.deleteToken(userId);
        socket.emit(SOCKETS.LOGOUT, true);
    }


    async updatePassword({token, hash}, socket) {
        let user = await this.db.getUserByToken(token);
        await this.db.updateToken(user.id, token);
        await this.db.updatePassword(user.id, hash);
        socket.emit(SOCKETS.UPDATE_PASSWORD, true);
    }
    
    

    async tokenVerification({token}, socket) {
        console.log(token);
        socket.emit(SOCKETS.TOKEN_VERIFICATION, true);
    }
}

module.exports = UserManager;