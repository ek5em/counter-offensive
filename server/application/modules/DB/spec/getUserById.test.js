
const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаем экземпляр класса DB

describe('GetUserById', () => {

    test('should get user by id', async () => {
        const testUserId = 1;
        const user = await db.getUserById(testUserId);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.id).toBe(testUserId);
    });

    test('the first user has the login testuse', async () =>{
        const testUserLogin = "testuse";
        const testUserId = 1;
        const user = await db.getUserById(testUserId);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.login).toBe(testUserLogin);
    })

    test('the first user has the nickname testuser', async () =>{
        const testUserNickname = "testuser";
        const testUserId = 1;
        const user = await db.getUserById(testUserId);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.nickname).toBe(testUserNickname);
    })

    test('getting a user by a non-existent id', async () =>{
        const testUserId = 10000000000000;
        const user = await db.getUserById(testUserId);
        
        expect(user).toBeUndefined();
    })
    
});

