const useLogoutHandler = (answer, userManager) => {
    return async (req, res) => {
        const {token} = req.params
        if (token) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await userManager.logout(user.id);
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));
            }
            else res.json(answer.bad(413));
        }
        else res.json(answer.bad(400));
    }
}

module.exports = useLogoutHandler;