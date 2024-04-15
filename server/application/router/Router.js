const express = require('express');
const router = express.Router();
const Answer = require('./Answer');
const useRegistrationHandler = require('./handlers/useRegistrationHandler');
const useLoginHandler = require('./handlers/useLoginHandler');
const useLogoutHandler = require('./handlers/useLogoutHandler');
const useUpdatePasswordHandler = require('./handlers/useUpdatePasswordHandler');

const useSendMessageHandler = require('./handlers/useSendMessageHandler');
const useGetMessageHandler = require('./handlers/useGetMessageHandler');

const useSetGamerRoleHandler = require('./handlers/useSetGamerRoleHandler');
const useGetLobbyHandler = require('./handlers/useGetLobbyHandler');
const useSuicideHandler = require('./handlers/useSuicideHandler');

const useMotionHandler = require('./handlers/useMotionHandler');
const useFireHandler = require('./handlers/useFireHandler');
const useGetSceneHandler = require('./handlers/useGetSceneHandler');

function Router(userManager, chatManager, lobbyManager, gameManager) {
    const answer = new Answer;

    // Регистрация
    // router.get('/registration/:login/:nickname/:hash', useRegistrationHandler(answer, userManager));
    // router.get('/login/:login/:password/:rnd', useLoginHandler(answer, userManager));
    // router.get('/logout/:token', useLogoutHandler(answer, userManager));
    // router.get('/updatePassword/:token/:hash', useUpdatePasswordHandler(answer, userManager));
    // Чат
    //router.get('/sendMessage/:token/:message', useSendMessageHandler(answer, userManager, chatManager));
    //router.get('/getMessages/:token/:hash', useGetMessageHandler(answer, userManager, chatManager));
    // Лобби
    // router.get('/setGamerRole/:token/:role/:tankId', useSetGamerRoleHandler(answer, userManager, lobbyManager));
    // router.get('/getLobby/:token/:hash', useGetLobbyHandler(answer, userManager, lobbyManager));
    // router.get('/suicide/:token', useSuicideHandler(answer, userManager, lobbyManager));
    // // Игра
    router.get('/motion/:token/:x/:y/:angle', useMotionHandler(answer, userManager, gameManager));
    router.get('/getScene/:token/:hashMap/:hashGamers/:hashMobs/:hashBullets/:hashBodies', useGetSceneHandler(answer, userManager, gameManager));
    router.get('/fire/:token/:x/:y/:angle', useFireHandler(answer, userManager, gameManager));
    
    router.all('/*', (req, res) => {
        res.send('Аааай! Не тот вход!..');
    });

    return router;
}

module.exports = Router;