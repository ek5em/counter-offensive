export const getExpPersents = (
    gamer_exp: number = 0,
    next_rank: number = 1
): number => {
    const persent = gamer_exp / (gamer_exp + next_rank);
    if (persent >= 1) {
        return 1;
    }
    return persent;
};
