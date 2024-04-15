const BaseModule = require("../BaseModule/BaseModule.js")
const { SOCKETS } = require("../../../config.js");

class ChatManager extends BaseModule {
    constructor(db, io, Mediator) {
        super(db, io, Mediator);
        if (!this.io) {
            return;
        }

        io.on('connection', (socket) => {
            socket.on(SOCKETS.SEND_MESSAGE, (data) => this.sendMessage(data, socket));
            socket.on('disconnect', () => console.log('disconnect', socket.id));
        });
    }

    async sendMessage({ token, message }, socket) {
        const { GET_USER } = this.Mediator.getTriggerTypes();
        const user = (await this.Mediator.get(GET_USER, token))[0];

        const pattern = /^[A-Za-zА-Яа-я0-9\s]{1,300}$/;
        if (pattern.test(message)) {
            if (user && user.token) {
                await this.db.addMessage(user[0].id, message);
                socket.emit(SOCKETS.SEND_MESSAGE, true);
                this.io.emit(SOCKETS.GET_MESSAGE, await this.db.getMessages());
                return;
            }
            socket.emit(SOCKETS.SEND_MESSAGE, 401);
        }
        else socket.emit(SOCKETS.SEND_MESSAGE, 432);

        
    }
}

module.exports = ChatManager;