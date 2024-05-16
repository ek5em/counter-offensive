const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

const uuid = require('uuid');

describe('addMessage', () => {
    
    test('сообщения получены', async () =>{    
        const messages = await db.getMessages();
        expect(messages).toBeInstanceOf(Object);
    })

    test('сообщение возвращается в нужном порядке', async () =>{    
        const testUserId = 1;
        const message = uuid.v4().slice(0, 10)
        await db.addMessage(testUserId, `${message}`)
        const messages = await db.getMessages();    
        expect(messages[0].text).toBe(`${message}`);
    })

    test('уровень соответствует действительному', async () =>{    
        const testUserId = 1;
        const message = uuid.v4().slice(0, 10)
        await db.addMessage(testUserId, `${message}`)
        const messages = await db.getMessages();    
        expect(messages[0].text).toBe(`${message}`);
    })

});
