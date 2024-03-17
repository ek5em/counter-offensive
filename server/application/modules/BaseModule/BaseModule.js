class BaseModule {
    constructor() {
        this.crypto = require('crypto');
        this.uuid = require('uuid');
    }
}
module.exports = BaseModule;
