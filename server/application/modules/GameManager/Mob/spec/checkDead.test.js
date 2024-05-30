const Mob = require("../Mob")

describe('Mob -> checkDead', () => {
    
    test('Проверка кол-ва жизней - живой', async () =>{
        x = 10;
        y = 10;
        type = 8;
        damage = 5;
        const mob = new Mob({x,y,type});
        mob.damage(damage);
        result = mob.checkDead();
        expect(result).toStrictEqual(false);
    })

    test('Проверка кол-ва жизней - трупик', async () =>{
        x = 10;
        y = 10;
        type = 8;
        damage = 10;
        const mob = new Mob({x,y,type});
        mob.damage(damage);
        result = mob.checkDead();
        expect(result).toStrictEqual(true);
    })
});