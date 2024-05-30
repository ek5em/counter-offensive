const Mob = require("../Mob");

describe('Mob -> move', () => {
    
    test('Движение моба - пехотинца', async () =>{
        x = 10;
        y = 10;
        type = 8;
        damage = 5;
        const mob = new Mob({x,y,type});
        mob.damage(damage);
        result = mob.hp;
        expect(result).toBe(3);
    })
});