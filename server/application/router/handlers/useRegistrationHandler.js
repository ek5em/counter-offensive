const useRegistrationHandler = (answer, userManager) => {
    return async (req, res) => {
        const {login, nickname, hash} = req.params;
        if (login && hash && nickname) {
            let pattern = /^[A-Za-zА-Яа-я0-9]{6,15}$/; //Выражение для логина
            let pattern1 = /^[A-Za-zА-Яа-я0-9]{3,16}$/; //Выражение для никнейма
            if (pattern.test(login) && pattern1.test(nickname)) {
                const result = await userManager.registration(login, nickname, hash);
                if (isNaN(parseInt(result))) res.json(answer.good(result)); 
                else res.json(answer.bad(result));      
            }
            else res.json(answer.bad(413));
        }
        else res.json(answer.bad(400));
    }
};

module.exports = useRegistrationHandler;