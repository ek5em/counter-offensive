const GameMath = require("../GameMath");
const gameMath = new GameMath();

describe('GameMath -> calculateAngle', () => {
    
    test('значение вычисляемого арктангенса', async () =>{
        x1 = 10;
        y1 = 10;
        x2 = 4;
        y2 = 6;
        result = gameMath.calculateAngle(x1, y1, x2, y2);
        expect(result).toBe(0.5880026035475675);
    })
});