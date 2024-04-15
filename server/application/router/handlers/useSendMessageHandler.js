const useSendMessageHandler = (answer, userManager, chatManager) => {
    return async (req, res) => {
       const {token, message} = req.params;
        if (token && message) {
            const pattern = /^[A-Za-zА-Яа-я0-9\s]{1,300}$/;
            if (pattern.test(message)) {
                const user = await userManager.getUser(token);
                if (user[0] && user[0].token != null) {
                    const result = await chatManager.sendMessage(user[0].id, message)
                    if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                    else res.json(answer.bad(result));
                }
                else res.json(answer.bad(401));
            }
            else res.json(answer.bad(432));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useSendMessageHandler;