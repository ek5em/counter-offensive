import { getExpString } from '../../helpers/getExpString'; 

describe('getExpString', () => {
  test('line with gamers exp and next tang', () => {
    expect(getExpString(100, 50)).toBe('100/150');
  });

  test('only line with gamers exp if next rang<= 0', () => {
    expect(getExpString(100, 0)).toBe('100');
    expect(getExpString(100, -10)).toBe('100');
  });

  test('correct value for default values', () => {
    expect(getExpString()).toBe('0/1');
  });

  test('correct line for random values', () => {
    expect(getExpString(200, 100)).toBe('200/300');
    expect(getExpString(0, 100)).toBe('0/100');
    expect(getExpString(150, 50)).toBe('150/200');
  });
});
