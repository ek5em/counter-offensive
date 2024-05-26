const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

describe('getMessage', () => {
    
    test('сообщения получены', async () =>{    
        const messages = await db.getMessages();
        expect(messages).toBeInstanceOf(Object);
    });

    test('Ранг соответствует действительному', async () =>{    
        let messages = await db.getMessages();
        if(messages.length === 0) {
            await db.addMessage(1, "asdasdasdasd")
        }
        messages = await db.getMessages();
        expect(messages[0].rankName).toBe('Private');
    });

    test('Уровень соответствует действительному', async () =>{    
        const messages = await db.getMessages();
        expect(messages[0].level).toBe(1);
    });

});
