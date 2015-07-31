CREATE TABLE IF NOT EXISTS `pboxes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(32),
  `x` float,
  `y` float,
  `color` int(11) NOT NULL,
  `text` varchar(256),
  `thumbs` int(11) DEFAULT '0',
  `ip` varchar(40),
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`,`x`,`y`)
);
