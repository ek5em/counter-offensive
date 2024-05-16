const GameMath = require("../GameMath");
const gameMath = new GameMath();

describe('GameMath -> shootReg', () => {
    
    test('miss', async () =>{
        targetX = 10;
        targetY = 10;
        bulletX1 = 4;
        bulletX2 = 6;
        bulletY1 = 4;
        bulletY2 = 6;
        area = 0.2;
        result = gameMath.shootReg(targetX, targetY, bulletX1, bulletY1, bulletX2, bulletY2, area);
        expect(result).toBe(false);
        //shootReg(x, y, x1, y1, x2, y2, area)
    })
    
    test('hit', async () => {
        targetX = 5;
        targetY = 5;
        bulletX1 = 4;
        bulletX2 = 6;
        bulletY1 = 4;
        bulletY2 = 6;
        area = 0.2;
        result = gameMath.shootReg(targetX, targetY, bulletX1, bulletY1, bulletX2, bulletY2, area);
        expect(result).toBe(40);
    });

});
