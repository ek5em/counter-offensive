const crypto = require('crypto');
const uuid = require('uuid');
const Answer = require("../../router/Answer");

class BaseModule {
    constructor(db, io, Mediator) {
        this.crypto = crypto;
        this.uuid = uuid;
        this.answer = new Answer;
        this.db = db;
        this.io = io;
        this.Mediator = Mediator;
    }
}
module.exports = BaseModule;
