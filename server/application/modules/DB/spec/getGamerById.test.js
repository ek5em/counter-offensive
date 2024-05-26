const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаем экземпляр класса DB

describe('GetGamerById', () => {
    test('the first gamer has the id 1', async () =>{
        const testGamerId = 1;
        const gamer = await db.getGamerById(testGamerId);
        
        expect(gamer).toBeInstanceOf(Object);
        expect(gamer.id).toBe(testGamerId);
    })
    
    test('the first gamer has the user_id 1', async () => {
        const testUserId = 1;
        const testGamerId = 1;
        const gamer = await db.getGamerById(testGamerId);
        
        expect(gamer).toBeInstanceOf(Object);
        expect(gamer.userId).toBe(testUserId);
    })
});