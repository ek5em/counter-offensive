const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаем экземпляр класса DB

describe('GetUserByLogin', () => {
    // ...

    
    test('the first user has the id testuse', async () =>{
        const testUserLogin = "testuse";
        const testUserId = 1;
        await db.getUserByToken(testUserLogin);
        const user = await db.getUserByToken(testUserLogin);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.id).toBe(testUserId);
    })
    
    test('should get user by login testuse', async () => {
        const testUserLogin = 'testuse';
        const user = await db.getUserByLogin(testUserLogin);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.login).toBe(testUserLogin);
    });
    
    test('the first user has the nickname testuser', async () =>{
        const testUserLogin = "testuse";
        const testUserNickname = "testuser";
        const user = await db.getUserByLogin(testUserLogin);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.nickname).toBe(testUserNickname);
    })

    test('getting a user by a non-existent login', async () =>{
        const testUserLogin = "84830b4";
        const user = await db.getUserByLogin(testUserLogin);
        expect(user).toBeUndefined();
    })
});