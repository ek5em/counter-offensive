const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('getBase', () => {

    test('Координата x базы верная', async () =>{    
        let base = await db.getBase();
        expect(base.x).toBe(134);
    });

    test('Координата y базы верная', async () =>{    
        let base = await db.getBase();
        expect(base.y).toBe(108);
    });

    test('Радиус базы верный', async () =>{    
        let base = await db.getBase();
        expect(base.radius).toBe(2);
    });

});
