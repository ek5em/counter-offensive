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
        expect(result).toStrictEqual([ 5.839748528310781, 7.226499018873854 ]);
    })
});