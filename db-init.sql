CREATE TABLE IF NOT EXISTS `game` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `timestamp` BIGINT NOT NULL DEFAULT 0,
  `timeout` INT NOT NULL DEFAULT 26,
  `startGameTimestamp` BIGINT NOT NULL DEFAULT 0,
  `mobBase_x` FLOAT NULL DEFAULT NULL,
  `mobBase_y` FLOAT NULL DEFAULT NULL,
  `base_radius` FLOAT NULL DEFAULT 2,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `users` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `login` VARCHAR(20) NOT NULL DEFAULT '',
  `nickname` VARCHAR(20) NOT NULL DEFAULT '', 
  `password` VARCHAR(100) NOT NULL DEFAULT '', 
  `token` VARCHAR(100) DEFAULT NULL, 
  `tokenLastUse` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00',
  `timeCreate` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `photo` VARCHAR(100) NOT NULL DEFAULT 'default.jpg',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `gamers` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `user_id` MEDIUMINT NOT NULL DEFAULT -1,
  `experience` INT NOT NULL DEFAULT 0,
  `money` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `persons` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Пехотинец',
  `hp` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(100) NOT NULL DEFAULT 'standartPerson.jpg',
  `reloadSpeed` FLOAT NOT NULL DEFAULT 1,
  `movementSpeed` FLOAT NOT NULL DEFAULT 1,
  `rotateSpeed` FLOAT NOT NULL DEFAULT 1,
  `level` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `kills` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `person_id` MEDIUMINT NOT NULL DEFAULT -1,
  `x` FLOAT NOT NULL,
  `y` FLOAT NOT NULL,
  `angle` FLOAT NOT NULL DEFAULT 0,
  `killTime` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `ranks` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL DEFAULT 'Медный ранг',
  `experience` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `games` ( 
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `startTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `endTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00', 
  `status` VARCHAR(10) NOT NULL DEFAULT 'end',
  `winner` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT, 
  `userId` MEDIUMINT NOT NULL DEFAULT -1,
  `text` VARCHAR(200) NOT NULL DEFAULT '',
  `sendTime` DATETIME NOT NULL DEFAULT '2000-10-01 00:00:00',
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `bodies` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `angle` FLOAT NULL DEFAULT NULL,
  `type` MEDIUMINT NOT NULL DEFAULT -1, 
  `isMob` BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `objects` (
  `id` MEDIUMINT NOT NULL AUTO_INCREMENT,
  `type` MEDIUMINT NOT NULL DEFAULT -1,
  `hp` INT NOT NULL DEFAULT 1000,
  `x` FLOAT NULL DEFAULT NULL,
  `y` FLOAT NULL DEFAULT NULL,
  `sizeX` TINYINT NOT NULL DEFAULT 0,
  `sizeY` TINYINT NOT NULL DEFAULT 0,
  `status` CHAR(1) NOT NULL DEFAULT 'a',
  `angle` FLOAT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

/* Создание юзеров для тестирования*/
-- У каждого пользователя пароль 12345678

INSERT INTO `users` (`login`, `nickname`, `password`) VALUES 
('testuse', 'testuser', 'f836c534387323b096f080676dfe75f8d486bb02aa76393f8fa12b6191b5434e'),
('testpuppy1', 'testuser', 'f1e4b081ffe08f6d8f9403ed1bc6b83ea6d027d8a9d6f73b5d1175bed693d385'),
('testpuppy2', 'testuser', '344af117117405ed0833acbd224d259b02da239ef686f32a5394f652f9dbfe9f'),
('testsergeant1', 'testuser', 'c47ecdbe986e2e7a3a7400b382ee8c7d8c8d283b3c38294eb9836e2145882508'),
('testsergeant2', 'testuser', '57d4716b29517cdef63b773faac14ee2ebd08b3f2f79b78412ce818ad438b62a'),
('testofficer1', 'testuser', '3defc6de1987c02e2456c44f25f5e3f9adf8f4155458562642a930a04d271883'),
('testofficer2', 'testuser', '6cc57c932bde7360e32109400438f8f6be28b5a908d6e6a1156b170859c69cdf'),
('testgeneral1', 'testuser', 'aac5a55cac1167803fb0437337f5236cc590c08b939add1f0eb753b5ac2a4547'),
('testgeneral2', 'testuser', 'f13da73dfccd34814fc79bdfd6d7d4d75b6369c1802ff89a3e522897c9d575c5');

INSERT INTO `gamers` (`user_id`, `experience`, `reload_timestamp`) VALUES
(1, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(2, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(3, 0, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(4, 720, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(5, 720, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(6, 5088, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(7, 5088, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(8, 9600, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)), 
(9, 17948, ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));

/* Значения по умолчанию в таблице game*/

INSERT INTO `game` (`timestamp`, `mobBase_x`, `mobBase_y`, `startGameTimestamp`) 
VALUES (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000), '134', '108', ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000));

/* Добавление уровней в таблицу ranks */
INSERT INTO `ranks` (`name`, `experience`) VALUES 
('Private', 0),
('Private', 144),
('Private', 288),
('Private', 480),
('Sergeant', 720),
('Sergeant', 1056),
('Sergeant', 1488),
('Sergeant', 2016),
('Sergeant', 2640),
('Sergeant', 3360),
('Sergeant', 4176),
('Officer', 5088),
('Officer', 6072),
('Officer', 7128),
('Officer', 8256),
('General', 9600),
('General', 11040),
('General', 12576),
('General', 14156),
('General', 17948);

/* Добавление ролей в таблицу persons*/
INSERT INTO `persons` (`name`, `hp`, `reloadSpeed`, `movementSpeed`, `rotateSpeed`, `level`) VALUES
('general', 10000, 2, 1, 1, 16),
('bannerman', 8, 1, 1, 1, 1),
('heavyTankGunner', 400, 7, 1, 1, 5),
('heavyTankMeh', 400, 7, 1, 1, 5),
('heavyTankCommander', 400, 7, 1, 1, 12),
('middleTankMeh', 250, 7, 1, 1, 5),
('middleTankGunner', 250, 7, 1, 1, 5),
('infantry', 8, 0.3, 1, 1, 1),
('infantryRPG', 8, 5, 1, 1, 1);

INSERT INTO `objects` (`x`, `y`, `angle`, `type`, `hp`, `sizeX`, `sizeY`, `status`) VALUES
/* Создание домов*/
(9, 25, 90, 1, 100, 3, 6, 'i'),
(32, 4, 90, 1, 100, 3, 6, 'i'),
(40, 22, 0, 1, 100, 6, 3, 'i'),
(70, 24, 90, 1, 100, 3, 6, 'i'),
(78, 3, 180, 1, 100, 6, 3, 'i'),
(18, 33, 0, 1, 100, 6, 3, 'i'),
(62, 36, 180, 1, 100, 6, 3, 'i'),
(130, 29, 180, 1, 100, 6, 3, 'i'),
(142, 10, 180, 1, 100, 6, 3, 'i'),
(39, 42, 270, 1, 100, 3, 6, 'i'),
(58, 42, 90, 1, 100, 3, 6, 'i'),
(119, 36, 90, 1, 100, 3, 6, 'i'),
(7, 70, 90, 1, 100, 3, 6, 'i'),
(7, 60, 90, 1, 100, 3, 6, 'i'),
(45, 64, 180, 1, 100, 6, 3, 'i'),
(54, 68, 270, 1, 100, 3, 6, 'i'),
(76, 61, 180, 1, 100, 6, 3, 'i'),
(81, 68, 270, 1, 100, 3, 6, 'i'),
(120, 56, 90, 1, 100, 3, 6, 'i'),
(128, 67, 0, 1, 100, 6, 3, 'i'),
(138, 58, 270, 1, 100, 3, 6, 'i'),
(122, 94, 180, 1, 100, 6, 3, 'i'),
(128, 85, 0, 1, 100, 6, 3, 'i'),
(140, 85, 0, 1, 100, 6, 3, 'i'),
(143, 94, 270, 1, 100, 3, 6, 'i'),
(7, 102, 90, 1, 100, 3, 6, 'i'),
(13, 110, 0, 1, 100, 6, 3, 'i'),
(24, 105, 0, 1, 100, 6, 3, 'i'),
(58, 104, 90, 1, 100, 3, 6, 'i'),
(64, 111, 0, 1, 100, 6, 3, 'i'),
(72, 102, 270, 1, 100, 3, 6, 'i'),
(117, 112, 0, 1, 100, 6, 3, 'i'),
(138, 115, 0, 1, 100, 6, 3, 'i'),
(145, 106, 270, 1, 100, 3, 6, 'i'),
(142, 36, 270, 1, 100, 3, 6, 'i'),
(14, 54, 180, 1, 100, 6, 3, 'i'),


/* Камни */
(32, 18, NULL, 2, 100, 2, 2, 'i'),
(49, 6, NULL, 2, 100, 2, 2, 'i'),
(59, 5, NULL, 2, 100, 2, 2, 'i'),
(61, 8, NULL, 2, 100, 2, 2, 'i'),
(86, 28, NULL, 2, 100, 2, 2, 'i'),
(8, 34, NULL, 2, 100, 2, 2, 'i'),
(46, 34, NULL, 2, 100, 2, 2, 'i'),
(74, 32, NULL, 2, 100, 2, 2, 'i'),
(71, 40, NULL, 2, 100, 2, 2, 'i'),
(94, 29, NULL, 2, 100, 2, 2, 'i'),
(100, 38, NULL, 2, 100, 2, 2, 'i'),
(101, 31, NULL, 2, 100, 2, 2, 'i'),
(112, 26, NULL, 2, 100, 2, 2, 'i'),
(122, 19, NULL, 2, 100, 2, 2, 'i'),
(120, 5, NULL, 2, 100, 2, 2, 'i'),
(131, 12, NULL, 2, 100, 2, 2, 'i'),
(132, 14, NULL, 2, 100, 2, 2, 'i'),
(14, 42, NULL, 2, 100, 2, 2, 'i'),
(26, 79, NULL, 2, 100, 2, 2, 'i'),
(63, 71, NULL, 2, 100, 2, 2, 'i'),
(61, 58, NULL, 2, 100, 2, 2, 'i'),
(79, 49, NULL, 2, 100, 2, 2, 'i'),
(91, 45, NULL, 2, 100, 2, 2, 'i'),
(97, 46, NULL, 2, 100, 2, 2, 'i'),
(142, 49, NULL, 2, 100, 2, 2, 'i'),
(120, 72, NULL, 2, 100, 2, 2, 'i'),
(41, 93, NULL, 2, 100, 2, 2, 'i'),
(64, 82, NULL, 2, 100, 2, 2, 'i'),
(47, 112, NULL, 2, 100, 2, 2, 'i'),
(42, 100, NULL, 2, 100, 2, 2, 'i'),
(120, 86, NULL, 2, 100, 2, 2, 'i'),
(42, 100, NULL, 2, 100, 2, 2, 'i'),
/* Пеньки */
(126, 4, NULL, 6, 100, 2, 2, 'a'),
(132, 24, NULL, 6, 100, 2, 2, 'a'),
(138, 8, NULL, 6, 100, 2, 2, 'a'),
(140, 52, NULL, 6, 100, 2, 2, 'a'),
(21, 75, NULL, 6, 100, 2, 2, 'a'),
(18, 78, NULL, 6, 100, 2, 2, 'a'),
(95, 73, NULL, 6, 100, 2, 2, 'a'),
(116, 90, NULL, 6, 100, 2, 2, 'a'),
(5, 83, NULL, 6, 100, 2, 2, 'a'),
(7, 78, NULL, 6, 100, 2, 2, 'a'),
(46, 104, NULL, 6, 100, 2, 2, 'a'),
(134, 116, NULL, 6, 100, 2, 2, 'a'),
(105, 115, NULL, 6, 100, 2, 2, 'a'),
(73, 114, NULL, 6, 100, 2, 2, 'a'),
(57, 113, NULL, 6, 100, 2, 2, 'a'),
(16, 116, NULL, 6, 100, 2, 2, 'a'),
(11, 117, NULL, 6, 100, 2, 2, 'a'),
(96, 4, NULL, 6, 100, 2, 2, 'a'),
/* Ежи */
(73, 9, NULL, 5, 100, 1, 1, 'a'),
(73, 11, NULL, 5, 100, 1, 1, 'a'),
(71, 18, NULL, 5, 100, 1, 1, 'a'),
(94, 14, NULL, 5, 100, 1, 1, 'a'),
(95, 8, NULL, 5, 100, 1, 1, 'a'),
(93, 16, NULL, 5, 100, 1, 1, 'a'),
(116, 14, NULL, 5, 100, 1, 1, 'a'),
(114, 16, NULL, 5, 100, 1, 1, 'a'),
(111, 18, NULL, 5, 100, 1, 1, 'a'),
(113, 21, NULL, 5, 100, 1, 1, 'a'),
(97, 21, NULL, 5, 100, 1, 1, 'a'),
(103, 45, NULL, 5, 100, 1, 1, 'a'),
(101, 48, NULL, 5, 100, 1, 1, 'a'),
(101, 57, NULL, 5, 100, 1, 1, 'a'),
(114, 57, NULL, 5, 100, 1, 1, 'a'),
(115, 51, NULL, 5, 100, 1, 1, 'a'),
(117, 68, NULL, 5, 100, 1, 1, 'a'),
(111, 40, NULL, 5, 100, 1, 1, 'a'),
(128, 56, NULL, 5, 100, 1, 1, 'a'),
(120, 75, NULL, 5, 100, 1, 1, 'a'),
(112, 74, NULL, 5, 100, 1, 1, 'a'),
(108, 76, NULL, 5, 100, 1, 1, 'a'),
(104, 80, NULL, 5, 100, 1, 1, 'a'),
(121, 81, NULL, 5, 100, 1, 1, 'a'),
(98, 83, NULL, 5, 100, 1, 1, 'a'),
(75, 84, NULL, 5, 100, 1, 1, 'a'),
(70, 85, NULL, 5, 100, 1, 1, 'a'),
(56, 84, NULL, 5, 100, 1, 1, 'a'),
(49, 87, NULL, 5, 100, 1, 1, 'a'),
(12, 89, NULL, 5, 100, 1, 1, 'a'),
(9, 94, NULL, 5, 100, 1, 1, 'a'),
(21, 91, NULL, 5, 100, 1, 1, 'a'),
(47, 90, NULL, 5, 100, 1, 1, 'a'),
(50, 93, NULL, 5, 100, 1, 1, 'a'),
(92, 91, NULL, 5, 100, 1, 1, 'a'),
(117, 93, NULL, 5, 100, 1, 1, 'a'),
(116, 98, NULL, 5, 100, 1, 1, 'a'),
(136, 102, NULL, 5, 100, 1, 1, 'a'),
(139, 106, NULL, 5, 100, 1, 1, 'a'),
(132, 112, NULL, 5, 100, 1, 1, 'a'),
(128, 109, NULL, 5, 100, 1, 1, 'a'),
(104, 102, NULL, 5, 100, 1, 1, 'a'),
(30, 101, NULL, 5, 100, 1, 1, 'a'),
(108, 100, NULL, 5, 100, 1, 1, 'a'),
(99, 87, NULL, 5, 100, 1, 1, 'a'),
(146, 103, NULL, 5, 100, 1, 1, 'a'),
(148, 102, NULL, 5, 100, 1, 1, 'a'),
/* Песок */
(51, 18, 90, 14, 100, 1, 3, 'a'),
(53, 12, 90, 14, 100, 1, 3, 'a'),
(71, 19, 270, 14, 100, 1, 3, 'a'),
(73, 13, 270, 14, 100, 1, 3, 'a'),
(94, 10, 270, 14, 100, 1, 3, 'a'),
(97, 18, 270, 14, 100, 1, 3, 'a'),
(116, 15, 270, 14, 100, 1, 3, 'a'),
(114, 18, 270, 14, 100, 1, 3, 'a'),
(29, 35, 180, 14, 100, 3, 1, 'a'),
(35, 37, 180, 14, 100, 3, 1, 'a'),
(107, 41, 0, 14, 100, 3, 1, 'a'),
(106, 42, 270, 14, 100, 1, 3, 'a'),
(101, 49, 270, 14, 100, 1, 3, 'a'),
(100, 54, 270, 14, 100, 1, 3, 'a'),
(116, 50, 0, 14, 100, 3, 1, 'a'),
(114, 54, 270, 14, 100, 1, 3, 'a'),
(129, 56, 0, 14, 100, 3, 1, 'a'),
(128, 57, 270, 14, 100, 1, 3, 'a'),
(13, 88, 0, 14, 100, 3, 1, 'a'),
(20, 89, 90, 14, 100, 1, 3, 'a'),
(29, 86, 0, 14, 100, 3, 1, 'a'),
(50, 87, 0, 14, 100, 3, 1, 'a'),
(48, 90, 270, 14, 100, 1, 3, 'a'),
(75, 85, 270, 14, 100, 1, 3, 'a'),
(93, 91, 0, 14, 100, 3, 1, 'a'),
(92, 92, 270, 14, 100, 1, 3, 'a'),
(98, 84, 270, 14, 100, 1, 3, 'a'),
(106, 71, 0, 14, 100, 3, 1, 'a'),
(105, 72, 270, 14, 100, 3, 1, 'a'),
(116, 94, 270, 14, 100, 1, 3, 'a'),
(112, 98, 0, 14, 100, 3, 1, 'a'),
(105, 112, 0, 14, 100, 3, 1, 'a'),
(104, 103, 270, 14, 100, 1, 3, 'a'),
(132, 102, 0, 14, 100, 3, 1, 'a'),
(129, 106, 270, 14, 100, 1, 3, 'a'),
(133, 111, 180, 14, 100, 3, 1, 'a'),
(138, 107, 90, 14, 100, 1, 3, 'a'),
(120, 78, 270, 14, 100, 1, 3, 'a');