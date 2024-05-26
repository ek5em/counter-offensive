const GameMath = require("../GameMath");
const gameMath = new GameMath();

describe('GameMath -> movePoint', () => {
    
    test('изменение координаты точки', async () =>{
        x1 = 10;
        y1 = 10;
        x2 = 4;
        y2 = 6;
        distance = 5;
        result = gameMath.calculateShiftPoint(x1, y1, x2, y2, distance);
        expectedResult = [x1 + (x2-x1) * distance / Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)), y1 + (y2-y1) * distance / Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))];
        expect(result).toStrictEqual(expectedResult);
    })
});