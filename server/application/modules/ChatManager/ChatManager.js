class ChatManager {
    constructor(db){
        this.db = db;
        this.crypto = require('crypto');
        this.uuid = require('uuid');
    }

    async sendMessage(userId, message) {
        await this.db.addMessage(userId, message);
        const hash = this.crypto.createHash('sha256').update(this.uuid.v4()).digest('hex');
        await this.db.updateChatHash(hash);
        return true;
    }
    

    async getMessages(oldHash) {
        const hash = await this.db.getGame();
        if (hash.chatHash !== oldHash) {
            const messages = await this.db.getMessages();
            return {"messages": messages, "chatHash": hash.chatHash};
        }
        return true;
    }
    
}

module.exports = ChatManager;