const DB = require('../DB'); // Импортируем класс DB
const db = new DB(); // Создаём класс DB

describe('getPersons', () => {
    
    test('количество персон правильное', async () =>{    
        const persons = await db.getPersons();
        expect(persons.length).toBe(9);
    });

    test('роль соответствует выбранной(генерал)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[0].name).toBe('general');
    });

    test('роль соответствует выбранной(знаменосец)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[1].name).toBe('bannerman');
    });

    test('роль соответствует выбранной(стрелок тяжелого танка)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[2].name).toBe('heavyTankGunner');
    });

    test('роль соответствует выбранной(механик тяжелого танка)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[3].name).toBe('heavyTankMeh');
    });

    test('роль соответствует выбранной(коммандир тяжелого танка)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[4].name).toBe('heavyTankCommander');
    }); 
    
    test('роль соответствует выбранной(механик среднего танка)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[5].name).toBe('middleTankMeh');
    }); 

    test('роль соответствует выбранной(стрелок среднего танка)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[6].name).toBe('middleTankGunner');
    }); 

    test('роль соответствует выбранной(пехотинец)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[7].name).toBe('infantry');
    }); 

    test('роль соответствует выбранной(пехотинец с РПГ)', async () =>{    
        const persons = await db.getPersons();
        expect(persons[8].name).toBe('infantryRPG');
    }); 
});
