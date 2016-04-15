-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Machine: 127.0.0.1
-- Gegenereerd op: 15 apr 2016 om 22:52
-- Serverversie: 5.6.17
-- PHP-versie: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `db_snaps`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `apertures`
--

CREATE TABLE IF NOT EXISTS `apertures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` decimal(3,1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Gegevens worden geëxporteerd voor tabel `apertures`
--

INSERT INTO `apertures` (`id`, `number`) VALUES
(1, '1.0'),
(3, '1.4'),
(4, '1.8'),
(5, '2.0'),
(6, '2.8'),
(7, '3.5'),
(8, '4.0'),
(9, '5.6'),
(10, '8.0'),
(11, '11.0'),
(12, '16.0'),
(13, '22.0'),
(14, '24.0');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cameras`
--

CREATE TABLE IF NOT EXISTS `cameras` (
  `camera_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `filepattern` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`camera_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden geëxporteerd voor tabel `cameras`
--

INSERT INTO `cameras` (`camera_id`, `type`, `name`, `filepattern`) VALUES
(1, 'ILCE-6000', 'Sony a6000', 'DSC#####'),
(2, 'iPhone5S', 'iPhone 5s', NULL),
(3, 'NIKON D3100', 'Nikon 3100', 'DSC_####');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `lenses`
--

CREATE TABLE IF NOT EXISTS `lenses` (
  `lens_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `min_aperture` decimal(3,1) NOT NULL,
  `max_aperture` decimal(3,1) NOT NULL,
  `min_focal_length` int(11) DEFAULT NULL,
  `max_focal_length` int(11) DEFAULT NULL,
  `camera_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`lens_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Gegevens worden geëxporteerd voor tabel `lenses`
--

INSERT INTO `lenses` (`lens_id`, `name`, `min_aperture`, `max_aperture`, `min_focal_length`, `max_focal_length`, `camera_id`) VALUES
(1, 'Sony E 16-50mm f/3.5-5.6 OSS PZ', '3.5', '22.0', 16, 50, 1),
(2, 'Samyang 12 mm f/2.0 NCS CS', '2.0', '22.0', 12, NULL, 1),
(3, 'Sigma 19mm f/2.8 DN ART', '2.8', '22.0', 19, NULL, 1),
(4, 'Sigma 30mm f/2.8 DN ART', '2.8', '22.0', 30, NULL, 1),
(5, 'AF-S DX NIKKOR 18-105MM F/3.5-5.6G ED VR', '3.5', '5.6', 18, 105, 3);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `series`
--

CREATE TABLE IF NOT EXISTS `series` (
  `series_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `lat` decimal(10,7) DEFAULT NULL,
  `lng` decimal(10,7) DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `snaps`
--

CREATE TABLE IF NOT EXISTS `snaps` (
  `snap_id` int(11) NOT NULL AUTO_INCREMENT,
  `series_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `camera_id` int(11) NOT NULL,
  `lens_id` int(11) NOT NULL,
  `file_name` varchar(25) NOT NULL,
  `focal_length` int(11) NOT NULL,
  `focal_distance` decimal(5,2) NOT NULL,
  `aperture_size` decimal(4,1) NOT NULL,
  `file_date` datetime DEFAULT NULL,
  `lat` decimal(10,7) NOT NULL,
  `lng` decimal(10,7) NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`snap_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Gegevens worden geëxporteerd voor tabel `snaps`
--

INSERT INTO `snaps` (`snap_id`, `series_name`, `camera_id`, `lens_id`, `file_name`, `focal_length`, `focal_distance`, `aperture_size`, `file_date`, `lat`, `lng`, `datetime`, `notes`) VALUES
(1, 'Kampina', 1, 2, '0', 12, '0.75', '5.6', '0000-00-00 00:00:00', '51.5538970', '5.2698771', '2016-04-11 22:26:07', ''),
(2, 'Kampina', 1, 2, '0', 12, '0.75', '11.0', '2016-04-15 20:32:07', '51.6301140', '5.5807167', '2016-04-15 22:32:07', ''),
(3, 'Kampina', 1, 2, '0', 12, '0.75', '11.0', '2016-04-15 20:32:55', '51.6301140', '5.5807167', '2016-04-15 22:32:55', ''),
(4, 'Kampina', 1, 2, '0', 12, '0.75', '11.0', '2016-04-15 20:33:15', '51.6301140', '5.5807167', '2016-04-15 22:33:15', ''),
(5, 'Kampina', 1, 2, 'DSC00011', 12, '0.75', '11.0', '2016-04-15 20:34:09', '51.6301140', '5.5807167', '2016-04-15 22:34:09', ''),
(6, 'Kampina', 1, 2, 'DSC00012', 12, '0.75', '11.0', '2016-04-15 20:34:39', '51.6301140', '5.5807167', '2016-04-15 22:34:39', 'Testing 1, 2, 3'),
(7, 'Kampina', 1, 2, 'DSC00013', 12, '0.75', '11.0', '2016-04-15 20:34:58', '51.6301140', '5.5807167', '2016-04-15 22:34:58', 'Testing 1, 2, 3');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
