const useLoginHandler = (answer, userManager) => {
    return async (req, res) => {
        const {login, password, rnd} = req.params
        if (login && password && rnd) {
            const result = await userManager.login(login, password, rnd);
            if (isNaN(parseInt(result))) res.json(answer.good(result));
            else res.json(answer.bad(result));
        }
        else res.json(answer.bad(400));
    }
}

module.exports = useLoginHandler;