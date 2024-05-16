const GameMath = require("../GameMath");
const gameMath = new GameMath();

describe('GameMath -> movePoint', () => {
    
    test('изменение координаты точки', async () =>{
        x = 0;
        y = 0;
        angle = 3;
        distance = 5;
        result = gameMath.movePoint(x, y, angle, distance);
        expectedResult = [x + distance * Math.cos(angle), y + distance * Math.sin(angle)];
        expect(result).toStrictEqual(expectedResult);
    })
});