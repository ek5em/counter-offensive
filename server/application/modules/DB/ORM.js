class ORM {
    constructor(db) {
        this.db = db;
    }

    async get(table, conditions = {}, fields = '*', operand = 'AND') { 
        const promise = new Promise((resolve, reject) => {
            const cond = [];
            const values = [];
            Object.keys(conditions).forEach(key => {
                cond.push(`${key}=?`);
                values.push(conditions[key]);
            });
            const query = `SELECT ${fields} FROM ${table} WHERE ${cond.join(` ${operand} `)}`;
            this.db.query(query, values, (error, results) => {
                if (error) {
                    reject(null);
                } else {
                    resolve(results);
                }
            });
        })
        const result = await promise;
        //return result ? result[0] : null;
        return result ? result : null;
    }

    all() { }
    update() { }
    insert() { }
    delete() { }
}

module.exports = ORM;