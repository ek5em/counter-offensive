const useMotionHandler = (answer, userManager, gameManager) => {
    return async (req, res) => {
        const {token ,x ,y ,angle} = req.params;

        if(token && x!==false && y!==false && angle!==false){
            const user = await userManager.getUser(token);
            if (user[0] && user[0].token != null) {
                const result = await gameManager.motion(user[0].id, parseFloat(x), parseFloat(y), parseFloat(angle))
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));
            }
            else res.json(answer.bad(401));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useMotionHandler;