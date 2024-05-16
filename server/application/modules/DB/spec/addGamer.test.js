const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('addGamer', () => {
    
    test('userId игрока соответствует его пользователю', async () =>{
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        const user = await db.getUserByLogin(testUserLogin);
        await db.addGamer(user.id);
        const gamer = await db.getGamerById(user.id);

        expect(gamer).toBeInstanceOf(Object);
        expect(gamer.userId).toBe(user.id);
    })
    
    test('Уровень нового пользователя равен 0', async () => {
        const testUserLogin = uuid.v4().slice(0, 10);
        const testUserNickname = uuid.v4().slice(0, 10);
        const testUserHash = uuid.v4().slice(0, 10);
        const testUserToken = uuid.v4().slice(0, 10);
        await db.addUser(testUserLogin, testUserNickname, testUserHash, testUserToken);
        const user = await db.getUserByLogin(testUserLogin);
        await db.addGamer(user.id);
        const gamer = await db.getGamerById(user.id);

        expect(gamer).toBeInstanceOf(Object);
        expect(gamer.experience).toBe(0);
    });

});
