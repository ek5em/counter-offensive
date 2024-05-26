const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаем экземпляр класса DB

describe('GetUserByToken', () => {
    test('the first user has the id testuse', async () =>{
        const testUserId = 1;
        const testUserToken = "eb629422832f57b1923cc6301eba5634ae28700b29d3b5f3975723550aa5e0b6"
        await db.updateToken(testUserId, testUserToken)

        const user = await db.getUserByToken(testUserToken);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.id).toBe(testUserId);
    })
    
    test('should get user by login testpuppy1', async () => {
        const testUserLogin = 'testpuppy1';
        const testUserId = 2;
        const testUserToken = "eb629462832f57b1923cc6301eba5634ae28700b29d3b5f3975723550aa5e0b6"
        await db.updateToken(testUserId, testUserToken)
        const user = await db.getUserByToken(testUserToken);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.login).toBe(testUserLogin);
    });
    
    test('the first user has the nickname testuser', async () =>{
        const testUserNickname = "testuser";
        const testUserId = 1;
        const testUserToken = "eb629422832f57b1923cc63016ba5634ae28700b29d3b5f3975723550aa5e0b6"
        await db.updateToken(testUserId, testUserToken)

        const user = await db.getUserByToken(testUserToken);
        
        expect(user).toBeInstanceOf(Object);
        expect(user.nickname).toBe(testUserNickname);
    })

    test('getting a user by a non-existent token', async () =>{
        const testUserId = 4;
        const userToken = "eb629422832f57b1923cc6301eba5638ae28700b29d3b5f3975723550aa5e0b6"
        await db.updateToken(testUserId, userToken)
        
        const testUserToken = "ebf3975723550aa5e0b6"
        const user = await db.getUserByToken(testUserToken);
        expect(user).toBeUndefined();
    })
});