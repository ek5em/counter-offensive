const BaseModule = require("../BaseModule/BaseModule.js")
const { SOCKETS } = require("../../../config.js");

class ChatManager extends BaseModule {
    constructor(db, io, mediator) {
        super(db, io, mediator);
        if (!this.io) {
            return;
        }

        io.on('connection', (socket) => {
            socket.on(SOCKETS.SEND_MESSAGE, (data) => this.sendMessage(data, socket));
            socket.on(SOCKETS.GET_MESSAGE, (data) => this.getMessage(data, socket));
            socket.on('disconnect', () => console.log('disconnect', socket.id));
        });
    }

    async sendMessage({ token, message }, socket) {
        const user = await this.mediator.get(this.TRIGGERS.GET_USER, token);

        const pattern = /^[A-Za-zА-Яа-я0-9\s]{1,300}$/;
        if (pattern.test(message)) {
            if (user && user.token) {
                await this.db.addMessage(user.id, message);
                socket.emit(SOCKETS.SEND_MESSAGE, this.answer.good(true));
                this.io.emit(SOCKETS.GET_MESSAGE, this.answer.good(await this.db.getMessages()));
                return;
            }
            socket.emit(SOCKETS.ERROR, this.answer.bad(401));
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(432));
    }

    async getMessage({ token }, socket) {
        const user = await this.mediator.get(this.TRIGGERS.GET_USER, token);

        if (user && user.token) {
            const result = await this.db.getMessages();
            console.log(result);
            socket.emit(SOCKETS.GET_MESSAGE, this.answer.good(result));
            return;
        }
        socket.emit(SOCKETS.ERROR, this.answer.bad(401));   
    }
}

module.exports = ChatManager;