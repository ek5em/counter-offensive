CREATE TABLE IF NOT EXISTS `game` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `hashUnits` VARCHAR(100) NOT NULL DEFAULT "",
  `hashScene` VARCHAR(100) NOT NULL DEFAULT "",
  `chatHash` VARCHAR(100) NOT NULL DEFAULT "",
  `hashBullets` VARCHAR(100) NOT NULL DEFAULT "",
  `hashLobby` VARCHAR(100) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `login` VARCHAR(20) NOT NULL DEFAULT "",
  `nickname` VARCHAR(20) NOT NULL DEFAULT "", 
  `password` VARCHAR(100) NOT NULL DEFAULT "", 
  `token` VARCHAR(100) NOT NULL DEFAULT "", 
  `tokenLastUse` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00",
  `timeCreate` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  `photo` VARCHAR(100) NOT NULL DEFAULT "default.jpg",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `gamers` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `experience` INT NOT NULL DEFAULT 0,
  `hp` INT NOT NULL DEFAULT 0,
  `money` INT NOT NULL DEFAULT 0,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NULL DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT "",
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `persons` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT "Пехотинец",
  `hp` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(100) NOT NULL DEFAULT "standartPerson.jpg",
  `reloadSpeed` FLOAT NOT NULL DEFAULT 1,
  `movementSpeed` FLOAT NOT NULL DEFAULT 1,
  `rotateSpeed` FLOAT NOT NULL DEFAULT 1,
  `level` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `ranks` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT "Медный ранг",
  `experience` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `games` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `users` VARCHAR(100) NOT NULL DEFAULT "[]", 
  `usersCount` INT NOT NULL DEFAULT 0, 
  `startTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  `endTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00", 
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `userId` MEDIUMINT NOT NULL DEFAULT -1,
  `text` VARCHAR(200) NOT NULL DEFAULT "",
  `sendTime` DATETIME NOT NULL DEFAULT "2000-10-01 00:00:00",
  PRIMARY KEY (`id`)
);

CREATE TABLE `tank_lobby` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `tank_id` INT NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`)
); 

/* Создание юзеров для тестирования*/

INSERT INTO users(login, nickname, password) VALUES 
('puppy1', 'regresskil', '4562df1406be2e97bae613dd15c16fa9b76a221ab550a9be1aa7c517277cc2be'),
('sergeant1', 'regresskil', '7dd348ad7304089af7276ce90a5406084cdf9622ff9b6ca3c25bf4bd3eed7d05'),
('officer1', 'regresskil', '0a83eaf3b88b3fd111dd87132231898ed41f13a634df5ebe3d4e9a4165292761'),
('general1', 'regresskil', 'c27d011242c894a577ddc4b2431c35a815c6bb5d981c1b13e24ff7cbdc66d617'),
('general2', 'regresskil', '641ccaeb2bae9253a03c2737b88706ff433804b3bd897ca73fb8b13bbe11a91a'),
('testuse', 'regresskil', 'f836c534387323b096f080676dfe75f8d486bb02aa76393f8fa12b6191b5434e'),
('puppy2', 'regresskil', 'c4afddcb4b4624193e2132e958dda90921a6ffe5950e467ad413c6e73c562921'),
('sergeant2', 'regresskil', '14daf687442d9d6a81e57e87e466d592f786fcfdfef65ba20c743b469bba4a7b'),
('officer2', 'regresskil', '2fb5c5cdd96005d70fc7f565f77d841ec4460985b78881baf7480a4e80cea815');

/* Значения по умолчанию в таблице game*/

INSERT INTO game(hashUnits, hashScene, chatHash, hashBullets, hashLobby) VALUES ("1", "1", "1", "1", "1");


/* Добавление уровней в таблицу ranks */
INSERT INTO ranks (id, name, experience) VALUES 
(1, "Private", 0),
(2, "Private", 144),
(3, "Private", 288),
(4, "Private", 480),
(5, "Sergeant", 720),
(6, "Sergeant", 1056),
(7, "Sergeant", 1488),
(8, "Sergeant", 2016),
(9, "Sergeant", 2640),
(10, "Sergeant", 3360),
(11, "Sergeant", 4176),
(12, "Officer", 5088),
(13, "Officer", 6072),
(14, "Officer", 7128),
(15, "Officer", 8256),
(16, "General", 9600),
(17, "General", 11040),
(18, "General", 12576),
(19, "General", 14156),
(20, "General", 17948);

/* Добавление ролей в таблицу persons*/
INSERT INTO `persons` (`id`, `name`, `hp`, `image`, `reloadSpeed`, `movementSpeed`, `rotateSpeed`, `level`) VALUES
(1, 'general', 100, 'standartPerson.jpg', 1, 1, 1, 16),
(2, 'bannerman', 100, 'standartPerson.jpg', 1, 1, 1, 1),
(3, 'heavyTankGunner', 100, 'standartPerson.jpg', 1, 1, 1, 5),
(4, 'heavyTankMeh', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(5, 'heavyTankCommander', 1000, 'standartPerson.jpg', 1, 1, 1, 12),
(6, 'middleTankMeh', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(7, 'middleTankGunner', 1000, 'standartPerson.jpg', 1, 1, 1, 5),
(8, 'infantry', 100, 'standartPerson.jpg', 1, 1, 1, 1),
(9, 'infantryRPG', 100, 'standartPerson.jpg', 1, 1, 1, 5);
