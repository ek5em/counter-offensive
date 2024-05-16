const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

describe('getRanks', () => {
    
    test('количество уровней правильное', async () =>{    
        const ranks = await db.getRanks();
        expect(ranks.length).toBe(20);
    });

    test('уровень соответсвует названию(Рядовой)', async () =>{    
        const ranks = await db.getRanks();
        expect(ranks[0].name).toBe("Private");
        expect(ranks[1].name).toBe("Private");
        expect(ranks[2].name).toBe("Private");
        expect(ranks[3].name).toBe("Private");
    });

    test('уровень соответсвует названию(Сержант)', async () =>{    
        const ranks = await db.getRanks();
        expect(ranks[4].name).toBe("Sergeant");
        expect(ranks[5].name).toBe("Sergeant");
        expect(ranks[6].name).toBe("Sergeant");
        expect(ranks[7].name).toBe("Sergeant");
        expect(ranks[8].name).toBe("Sergeant");
        expect(ranks[9].name).toBe("Sergeant");
        expect(ranks[10].name).toBe("Sergeant");
    });

    test('уровень соответсвует названию(Офицер)', async () =>{    
        const ranks = await db.getRanks();
        expect(ranks[11].name).toBe("Officer");
        expect(ranks[12].name).toBe("Officer");
        expect(ranks[13].name).toBe("Officer");
        expect(ranks[14].name).toBe("Officer");
    });

    test('уровень соответсвует названию(Генерал)', async () =>{    
        const ranks = await db.getRanks();
        expect(ranks[15].name).toBe("General");
        expect(ranks[16].name).toBe("General");
        expect(ranks[17].name).toBe("General");
        expect(ranks[18].name).toBe("General");
        expect(ranks[19].name).toBe("General");
    });

});
