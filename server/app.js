const express = require('express');
const app = express();

const UserManager = require('./application/modules/UserManager/UserManager');
const ChatManager = require('./application/modules/ChatManager/ChatManager');
const LobbyManager = require('./application/modules/LobbyManager/LobbyManager');
const GameManager = require('./application/modules/GameManager/GameManager');

const DB = require('./application/modules/DB/DB');


const Router = require('./application/router/Router');

const db = new DB;
const userManager = new UserManager(db);
const chatManager = new ChatManager(db);
const lobbyManager = new LobbyManager(db);
const gameManager = new GameManager(db);

const router = new Router(userManager, chatManager, lobbyManager, gameManager);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(`${__dirname}/public`));
app.use('/', router);

app.listen(3000, () => console.log('Backend Live Matters!!!')); 