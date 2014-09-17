CREATE TABLE IF NOT EXISTS `ad_actions` (
  `ad_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `action` varchar(40) NOT NULL,
  `count` bigint(20) NOT NULL,
  `value` bigint(20) NOT NULL,
  PRIMARY KEY (`ad_id`,`date`,`action`)
);

CREATE TABLE IF NOT EXISTS `ad_statistics` (
  `ad_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `impressions` bigint(20) NOT NULL,
  `clicks` bigint(20) NOT NULL,
  `spent` bigint(20) NOT NULL,
  PRIMARY KEY (`ad_id`,`date`)
);