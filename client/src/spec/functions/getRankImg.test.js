import { getRankImg } from '../../helpers/getRankImg'; 
import { ERank } from '../../modules/Server/interfaces';
import { firstRank, secondRank, thirdRank, fourthRank } from '../../assets/png';

describe('getRankImg', () => {
  test('firstRank if ERank.Private', () => {
    expect(getRankImg(ERank.Private)).toBe(firstRank);
  });

  test('secondRank if ERank.Sergeant', () => {
    expect(getRankImg(ERank.Sergeant)).toBe(secondRank);
  });

  test('thirdRank if ERank.Officer', () => {
    expect(getRankImg(ERank.Officer)).toBe(thirdRank);
  });

  test('fourthRank if ERank.General', () => {
    expect(getRankImg(ERank.General)).toBe(fourthRank);
  });

  test('firstRank if null', () => {
    expect(getRankImg()).toBe(firstRank);
  });

  test('firstRank if undefined', () => {
    expect(getRankImg(null)).toBe(firstRank);
    expect(getRankImg(undefined)).toBe(firstRank);
  });
});