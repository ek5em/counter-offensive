const useSetGamerRoleHandler = (answer, userManager, lobbyManager) => {
    return async (req, res) => {
        const {token, role, tankId} = req.params
        if (role && token && tankId) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await lobbyManager.setGamerRole(user[0].id, parseInt(role), tankId)
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));
            }
            else res.json(answer.bad(401));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useSetGamerRoleHandler;