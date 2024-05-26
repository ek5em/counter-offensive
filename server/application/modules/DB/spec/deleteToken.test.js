const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('deleteToken', () => {
    
    test('токен был удален', async () =>{
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        let user = await db.getUserByLogin(testUserLogin);    
        await db.deleteToken(user.id)
        user = await db.getUserByLogin(testUserLogin);    
        expect(user).toBeInstanceOf(Object);
        expect(user.token).toBe(null);
    })
    
    test('пользователя нельзя найти по токену', async () => {
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        let user = await db.getUserByLogin(testUserLogin);    
        await db.deleteToken(user.id)
        user = await db.getUserByToken(testUserToken);

        expect(user).toBeUndefined();
    });

});
