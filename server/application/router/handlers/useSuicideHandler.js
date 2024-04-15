const useSuicideHandler = (answer, userManager, lobbyManager) => {
    return async (req, res) => {
        const { token} = req.params;
        if (token) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await lobbyManager.suicide(user[0].id)
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));   
            }
            else return 401;
        }  
        else return 400;
    }
};

module.exports = useSuicideHandler;