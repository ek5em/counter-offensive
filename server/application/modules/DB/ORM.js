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
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
        const result = await promise;
        // return result ? result[0] : null;
        return result ? result : null;
    }

    async all(table, conditions = {}, fields = '*', operand = 'AND', sorting = '', limit = '') {
        const promise = new Promise((resolve, reject) => {
            const cond = [];
            const values = [];
            Object.keys(conditions).forEach(key => {
                cond.push(`${key}=?`);
                values.push(conditions[key]);
            });

            let where = ``;
            if(Object.keys(conditions).length !== 0) {
                where = 'WHERE';
            }

            let sortingClause = '';
            if (sorting) {
                sortingClause = `ORDER BY ${sorting}`;
            }

            let limitClause = '';
            if (limit) {
                limitClause = `LIMIT ${limit}`;
            }

            const query = `SELECT ${fields} FROM ${table} ${where} ${cond.join( `${operand}`)} ${sorting} ${limitClause}`;
            this.db.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
        const result = await promise;
        return result ? result : null;
    }

    async update(table, conditions = {}, fields = '*', newData = [], operand = 'AND') {  
        const promise = new Promise((resolve, reject) => {
            const cond = [];
            const values = newData;
            const updateFields = [];
            fields.split(",").forEach(field => {
                updateFields.push(`${field}=?`);
            })
            Object.keys(conditions).forEach(key => {
                cond.push(`${key}=?`);
                values.push(conditions[key]);
            });
            
            const query = `UPDATE ${table} SET ${updateFields.join(`, `)} WHERE ${cond.join(`${operand}`)}`;
            this.db.query(query, values, (error, results) => {
                if (error) {
                    console.log("error")
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        })
    }

    insert(table, fields = '*', newData = []) { 
        const promise = new Promise((resolve, reject) => {
    
            let values = [];
            for(let i=0; i<newData.length; i++){
                values.push("?")
            }

            const query = `INSERT INTO ${table} (${fields}) VALUES (${values.join(', ')})`;
            this.db.query(query, newData, (error, results) => {
                if (error) {
                    reject(null);
                } else {
                    resolve(results);
                }
            });
        })
    }

    async delete(table, conditions = {}, operand = 'AND') { 
        const promise = new Promise((resolve, reject) => {
            const cond = [];
            const values = [];
       
            Object.keys(conditions).forEach(key => {
                cond.push(`${key}=?`);
                values.push(conditions[key]);
            });

            const query = `DELETE FROM ${table} WHERE ${cond.join(` ${operand} `)}`;
            this.db.query(query, values, (error, results) => {
                if (error) {
                    reject(null);
                } else {
                    resolve(results);
                }
            });
        })
    }
}

module.exports = ORM;