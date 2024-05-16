const BaseModule = require('../BaseModule/BaseModule');
const User = require('./User');
const { SOCKETS } = require("../../../config.js");

class UserManager extends BaseModule {
    constructor(db, io, mediator) {
        super(db, io, mediator);
        this.users = {};

        if (!this.io) {
            return;
        }

        io.on('connection', (socket) => {
            socket.on(SOCKETS.REGISTRATION, (data) => this.registration(data, socket));
            socket.on(SOCKETS.LOGIN, (data) => this.login(data, socket));
            socket.on(SOCKETS.LOGOUT, (data) => this.logout(data, socket));
            socket.on(SOCKETS.TOKEN_VERIFICATION, (data) => this.tokenVerification(data, socket)); 
            socket.on('disconnect', () => console.log('disconnect'));
            // socket.on('disconnect', () => this.logout(this.getUserBySocketId(socket.id).token));
        });

        this.mediator.set(this.TRIGGERS.GET_USER, (token) => this._getUserByToken(token));
        this.mediator.set(this.TRIGGERS.ALL_USERS, () => this.users);
    
    }

    _getUserByToken(token) {
        if (token) {
            return Object.values(this.users).find(user => user.token === token);
        }
        return null;
    }

    getUserBySocketId(socketId) {
        if (socketId) {
            return Object.values(this.users).find(user => user.socketId === socketId);
        }
        return null;
    }

    async registration(data = {}, socket) {
        const {login, nickname, hash} = data;
        if (login && nickname && hash) {
            const user = new User({
                db: this.db,
                crypto: this.crypto,
                uuid: this.uuid,
                socketId: socket.id
            });
            if (await user.registration(login, nickname, hash)) {
                this.users[user.id] = user;
                socket.emit(SOCKETS.LOGIN, this.answer.good({ ...user.get() }));
                return;
            }
            return;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(461));
    }

    async login(data = {}, socket) {
        const { login, hash, rnd } = data;
        if (login && hash && rnd) {
            const user = new User({
                db: this.db,
                crypto: this.crypto,
                uuid: this.uuid,
                socketId: socket.id
            });
            if (await user.login(login, hash, rnd)) {
                this.users[user.id] = user;
                socket.emit(SOCKETS.LOGIN, this.answer.good({ ...user.get() }));
                return;
            }
            return;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(461));
    }


    async logout(data = {}, socket) {
        const { token } = data;
        const user = this._getUserByToken(token);
        if (user) {
            if (await user.logout(token)) {
                delete this.users[user.id];
                socket.emit(SOCKETS.LOGOUT, this.answer.good(true));
                return;
            }
            socket.emit(SOCKETS.ERROR, this.answer.bad(413));
            return;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(413));
        return;
    }
    
    // не приходит токен
    async tokenVerification(data = {}, socket) {
        const { token } = data;
        if(token) {
            const user = new User({
                db: this.db,
                crypto: this.crypto,
                uuid: this.uuid,
                socketId: socket.id
            });
            if (await user.tokenVerification(token)) {
                this.users[user.id] = user;
                socket.emit(SOCKETS.TOKEN_VERIFICATION, this.answer.good({token: token}));
                return;
            }
            socket.emit(SOCKETS.ERROR, this.answer.bad(4089));
            return;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(461));
    }
}

module.exports = UserManager;