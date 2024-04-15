class Mediator {
    constructor({ TRIGGERS }) {
        this.TRIGGERS = TRIGGERS;
        this.triggers = {};
        Object.keys(TRIGGERS).forEach((key) => (this.triggers[key] = () => null));
    }

    getTriggerTypes() {
        return this.TRIGGERS;
    }

    set(name, func) {
        if (name && this.triggers[name] && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    get(name, data = null) {
        if (name && this.triggers[name] instanceof Function) {
            return this.triggers[name](data);
        }
        return null;
    }
}

module.exports = Mediator;
