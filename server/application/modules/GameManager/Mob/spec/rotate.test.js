const Mob = require("../Mob");

describe('Mob -> rotate', () => {
    
    test('Поворот моба - пехотинца', async () =>{
        x = 10;
        y = 10;
        type = 8;
        const mob = new Mob({x,y,type});
        mob.rotate(90);
        result = mob.angle;
        expect(result).toBe(90);
    })
});