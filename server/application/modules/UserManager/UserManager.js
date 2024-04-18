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

    async registration({login, nickname, hash}, socket) {
        let pattern = /^[A-Za-zА-Яа-я0-9]{6,15}$/; //Выражение для логина
        let pattern1 = /^[A-Za-zА-Яа-я0-9]{3,16}$/; //Выражение для никнейма
        if (pattern.test(login) && pattern1.test(nickname)) {
            const checkUser = await this.db.getUserByLogin(login);
            if (checkUser.length !== 0) socket.emit(SOCKETS.REGISTRATION, this.answer.bad(460));
            const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
            await this.db.addUser(login, nickname, hash, token);
            const user = (await this.db.getUserByToken(token))[0];
            await this.db.addGamer(user.id);
            socket.emit(SOCKETS.REGISTRATION, this.answer.good({token: token}));      
            return ;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(413));
        
    }

    async login({login, hash, rnd}, socket) {
        const token = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        const user = (await this.db.getUserByLogin(login))[0];
        if (user && user.login) {
            const hashS = this.crypto.createHash('sha256').update(user.password + rnd).digest('hex'); // Хэш штрих. Строка сгенерированая с помощью хранящейсяв базе хэш-суммы
            if (hash == hashS) {
                await this.db.updateToken(user.id, token);
                socket.emit(SOCKETS.LOGIN, this.answer.good({ token: token }));
                return ; 
            }
            socket.emit(SOCKETS.ERROR, this.answer.bad(403));
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(461));
    }


    async logout({token}, socket) {
        const user = (await this.db.getUserByToken(token))[0];
        if (user && user.token) {
            await this.db.deleteToken(user.id);
            socket.emit(SOCKETS.LOGOUT, this.answer.good(true));
            return ;
        }
        else socket.emit(SOCKETS.ERROR, this.answer.bad(413));
        await this.db.deleteToken(user.id);
        socket.emit(SOCKETS.LOGOUT, this.answer.good(true));
    }


    async updatePassword({token, hash}, socket) {
        const user = await this.db.getUserByToken(token);
        await this.db.updateToken(user.id, token);
        await this.db.updatePassword(user.id, hash);
        socket.emit(SOCKETS.UPDATE_PASSWORD, this.answer.good(true));
    }
    
    

    async tokenVerification({token}, socket) {
        const user = (await this.db.getUserByToken(token))[0];
        if (user && user.token) {
            socket.emit(SOCKETS.TOKEN_VERIFICATION, this.answer.good(true));
            return ;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(401));
    }
}

module.exports = UserManager;