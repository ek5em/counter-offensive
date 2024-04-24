export const getExpString = (
    gamer_exp: number = 0,
    next_rank: number = 1
): string => {
    if (next_rank <= 0) {
        return `${gamer_exp}`;
    }
    return `${gamer_exp}/${gamer_exp + next_rank}`;
};
