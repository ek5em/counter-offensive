const useUpdatePasswordHandler = (answer, userManager) => {
    return async (req, res) => {
        const { token, hash} = req.params;
        if (token && hash) {
            const result = await userManager.updatePassword()
            if (isNaN(parseInt(result))) res.json(answer.bad(result));
            res.json(answer.good(result));
        }
        res.json(answer.bad(400));
    }
};

module.exports = useUpdatePasswordHandler;