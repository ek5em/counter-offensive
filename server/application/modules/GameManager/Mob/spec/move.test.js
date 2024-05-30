const Mob = require("../Mob");

describe('Mob -> move', () => {
    
    test('Движение моба - пехотинца', async () =>{
        x = 10;
        dx = 10;
        y = 10;
        dy = 10;
        type = 8;
        const mob = new Mob({x,y,type});
        mob.move(dx,dy);
        result = [mob.x,mob.y];
        expect(result).toStrictEqual([20,20]);
    })
});