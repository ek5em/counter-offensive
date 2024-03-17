const useGetMessageHandler = (answer, userManager, chatManager) => {
    return async(req, res) => {
       const {token, hash} = req.params;
        if (token && hash) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await chatManager.getMessages(hash)
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));
            }
            else res.json(answer.bad(401));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useGetMessageHandler;