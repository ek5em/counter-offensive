type TAnyFunction = (data: any | undefined) => void;

export type TEVENTS = {
    [key: string]: string;
};

type TEvents = {
    [key: string]: Array<TAnyFunction>;
};

type TTriggers = {
    [key: string]: TAnyFunction;
};

type TParams = {
    EVENTS: TEVENTS;
    TRIGGERS: TEVENTS;
};

export default class Mediator {
    TRIGGERS: TEVENTS;
    EVENTS: TEVENTS;
    events: TEvents;
    triggers: TTriggers;

    constructor({ EVENTS, TRIGGERS }: TParams) {
        this.EVENTS = EVENTS;
        this.TRIGGERS = TRIGGERS;
        this.events = {};
        this.triggers = {};
        Object.keys(EVENTS).forEach((key) => (this.events[key] = []));
        Object.keys(TRIGGERS).forEach(
            (key) => (this.triggers[key] = () => null)
        );
    }

    /***************/
    /* ПРО СОБЫТИЯ */
    /***************/
    getEventTypes(): TEVENTS {
        return this.EVENTS;
    }

    subscribe(name: string, func: TAnyFunction) {
        if (name && this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    call<T>(name: string, data: T | undefined) {
        if (name && this.events[name]) {
            this.events[name].forEach(
                (func) => func instanceof Function && func(data)
            );
        }
    }

    /************************/
    /* ПРО ПОЛУЧЕНИЕ ДАННЫХ */
    /************************/
    getTriggerTypes(): TEVENTS {
        return this.TRIGGERS;
    }

    set(name: string, func: TAnyFunction) {
        if (name && this.triggers[name] && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    unSet(name: string) {
        if (name && this.triggers[name]) {
            this.triggers[name] = () => {};
        }
    }

    get<T>(name: string, data: T | undefined = undefined) {
        if (name && this.triggers[name] instanceof Function) {
            return this.triggers[name](data);
        }
        return null;
    }
}
