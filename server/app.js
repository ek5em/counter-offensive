const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});
const { MEDIATOR } = require("./config.js"); 

const DB = require('./application/modules/DB/DB');
const UserManager = require('./application/modules/UserManager/UserManager');
const ChatManager = require('./application/modules/ChatManager/ChatManager');
const LobbyManager = require('./application/modules/LobbyManager/LobbyManager');
const GameManager = require('./application/modules/GameManager/GameManager');
const Router = require('./application/router/Router');
const Mediator = require("./application/router/Mediator/Mediator")

const mediator = new Mediator(MEDIATOR);
const db = new DB;
const userManager = new UserManager(db, io, mediator);
const chatManager = new ChatManager(db, io, mediator);
const lobbyManager = new LobbyManager(db, io, mediator);
const gameManager = new GameManager(db, io, mediator);

const router = new Router(userManager, chatManager, lobbyManager, gameManager);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(`${__dirname}/public`));
app.use('/', router);

server.listen(3000, () => console.log('Backend Lives Matter!!!')); 