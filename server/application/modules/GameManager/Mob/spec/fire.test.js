const Mob = require("../Mob");

describe('Mob -> fire', () => {
    
    test('Неудачный выстрел моба - пехотинца', async () =>{
        x = 10;
        y = 10;
        type = 8;
        const mob = new Mob({x,y,type});
        result = mob.fire();
        expect(result).toBe(false);
    })

    test('Удачный выстрел моба - пехотинца', async () =>{
        x = 10;
        y = 10;
        type = 8;
        const mob = new Mob({x,y,type});
        timeStamp = 150;
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < timeStamp);
        result = mob.fire();
        expect(result).toBe(true);
    })
});