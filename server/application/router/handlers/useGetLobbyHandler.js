const useGetLobbyHandler = (answer, userManager, lobbyManager) => {
    return async (req, res) => {
       const {token, hash} = req.params;
        if (token && hash) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
               const result = await lobbyManager.getLobby(user[0].id, hash)
               if (isNaN(parseInt(result))) res.json(answer.good(result)); 
               else res.json(answer.bad(result));
           }
           else res.json(answer.bad(413));
       }
       else res.json(answer.bad(400));
   }
};

module.exports = useGetLobbyHandler;