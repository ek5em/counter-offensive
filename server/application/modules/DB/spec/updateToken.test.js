const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('updateToken', () => {
    
    test('токен успешно обновился', async () =>{
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        const testNewToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        let user = await db.getUserByLogin(testUserLogin);    
        await db.updateToken(user.id, testNewToken)
        user = await db.getUserByLogin(testUserLogin);    
        expect(user).toBeInstanceOf(Object);
        expect(user.token).toBe(testNewToken);
    })
    
    test('Пользователя можно найти по новому токену', async () => {
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        const testNewToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        let user = await db.getUserByLogin(testUserLogin);    
        await db.updateToken(user.id, testNewToken)
        user = await db.getUserByToken(testNewToken);

        expect(user).toBeInstanceOf(Object);
        expect(user.token).toBe(testNewToken);
    });

});
