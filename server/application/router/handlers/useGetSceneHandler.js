const useGetSceneHandler = (answer, userManager, gameManager) => {
    return async (req, res) =>  {
        const {token, hashMap, hashGamers, hashMobs, hashBullets, hashBodies} = req.params;
        if(token && hashMap && hashBodies && hashMobs && hashGamers && hashBullets) {
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await gameManager.getScene(user[0].id, hashGamers, hashMobs, hashBullets, hashMap, hashBodies)
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));   
            }
            else res.json(answer.bad(401));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useGetSceneHandler;