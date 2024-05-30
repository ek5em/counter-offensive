import { getRankName } from '../../helpers/getRankName';
import { ERank } from '../../modules/Server/interfaces';

describe('getRankName', () => {
  test(' "Генерал" if ERank.General', () => {
    expect(getRankName(ERank.General)).toBe('Генерал');
  });

  test('"Офицер" if ERank.Officer', () => {
    expect(getRankName(ERank.Officer)).toBe('Офицер');
  });

  test(' "Рядовой" if ERank.Private', () => {
    expect(getRankName(ERank.Private)).toBe('Рядовой');
  });

  test(' "Сержант" if ERank.Sergeant', () => {
    expect(getRankName(ERank.Sergeant)).toBe('Сержант');
  });

  test('empty line if defoult value', () => {
    expect(getRankName()).toBe('');
  });

  test('empty line if undefined', () => {
    expect(getRankName(null)).toBe('');
    expect(getRankName(undefined)).toBe('');
  });
});
