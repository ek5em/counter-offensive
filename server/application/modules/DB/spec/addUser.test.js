const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('addUser', () => {
    
    test('the first user has the id 1', async () =>{
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        const user = await db.getUserByLogin(testUserLogin);
        expect(user).toBeInstanceOf(Object);
        expect(user.nickname).toBe(testUserNickname);
    })
    
    test('should get user by login testuse', async () => {
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        const user = await db.getUserByLogin(testUserLogin);
        expect(user).toBeInstanceOf(Object);
        expect(user.password).toBe(testUserHash);
    });

});
