const GameMath = require("../GameMath");
const gameMath = new GameMath();

describe('GameMath -> movePoint', () => {
    
    test('изменение координаты точки', async () =>{
        x = 0;
        y = 0;
        angle = 3;
        distance = 5;
        result = gameMath.movePoint(x, y, angle, distance);
        expect(result).toStrictEqual([ -4.949962483002227, 0.7056000402993361 ]);
    })
});