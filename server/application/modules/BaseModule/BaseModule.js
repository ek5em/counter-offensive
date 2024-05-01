const crypto = require('crypto');
const uuid = require('uuid');
const Answer = require("../../router/Answer");

class BaseModule {
    constructor(db, io, mediator) {
        this.crypto = crypto;
        this.uuid = uuid;
        this.answer = new Answer;
        this.db = db;
        this.io = io;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggerTypes();
    }
}
module.exports = BaseModule;
