-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 08, 2024 at 12:55 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `schoolacl`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Grades`
--

CREATE TABLE `Grades` (
  `id` int(11) NOT NULL,
  `grade` decimal(4,2) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `schoolId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Grades`
--

INSERT INTO `Grades` (`id`, `grade`, `description`, `createdAt`, `updatedAt`, `subjectId`, `teacherId`, `studentId`, `schoolId`) VALUES
(1, 5.00, 'great work!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 5, 8, 1),
(2, 4.50, 'just okay!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 5, 9, 1),
(3, 4.00, 'OK!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 5, 9, 1),
(4, 5.00, 'very OK!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 3, 6, 10, 1),
(5, 5.50, 'amazing!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 3, 5, 10, 1),
(6, 3.50, 'poor!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 3, 5, 11, 1),
(7, 4.50, 'okay!', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 3, 5, 11, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Schools`
--

CREATE TABLE `Schools` (
  `id` int(11) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `directorId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Schools`
--

INSERT INTO `Schools` (`id`, `name`, `address`, `createdAt`, `updatedAt`, `directorId`) VALUES
(1, 'University #0001', 'Wilcza 7, 00-001 Warszawa', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 2),
(2, 'University #0002', 'Pl. Marii Curie Skłodowskiej 51, 20-001 Lublin', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 3),
(3, 'University #0003', 'Puławska 17, 24-001 Radom', '2024-04-08 10:42:23', '2024-04-08 10:42:23', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Subjects`
--

CREATE TABLE `Subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `schoolId` int(11) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Subjects`
--

INSERT INTO `Subjects` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `schoolId`, `teacherId`) VALUES
(1, 'Math', NULL, '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 5),
(2, 'Eng', NULL, '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 5),
(3, 'Programming', NULL, '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1, 6);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `SubjectUsers`
--

CREATE TABLE `SubjectUsers` (
  `subjectId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `SubjectUsers`
--

INSERT INTO `SubjectUsers` (`subjectId`, `userId`) VALUES
(1, 8),
(1, 9),
(2, 9),
(2, 10),
(3, 9),
(3, 10),
(3, 11);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `surname` varchar(64) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT 18,
  `address` varchar(256) DEFAULT NULL,
  `role` enum('admin','director','teacher','student') NOT NULL DEFAULT 'student',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `schoolId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `name`, `surname`, `email`, `password`, `age`, `address`, `role`, `createdAt`, `updatedAt`, `schoolId`) VALUES
(1, 'Admin', 'Admin', 'admin@example.com', '$2a$10$cwldOyv/xWD4.Ih.MHi14ORnFx0A54p.Nwi0xWu.dpi8XhREtXB32', 18, NULL, 'admin', '2024-04-08 10:42:23', '2024-04-08 10:42:23', NULL),
(2, 'Adam', 'Adamski', 'director1@example.com', '$2a$10$w2i5.2RhYjBKyJ.iYrTHq.AndtjcAUSrv5rXn13lkvA1RY5/4Oppu', 18, NULL, 'director', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 1),
(3, 'Barbara', 'Łapska', 'director2@example.com', '$2a$10$8HkQzgj.idxczfmjXns/qOdD.odFw9Ald6mjj/LnB9LmypbeZShA6', 18, NULL, 'director', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 2),
(4, 'Grzegorz', 'Brzeczyszczywkiewicz', 'director3@example.com', '$2a$10$MHMqKexol5en8GDavk4IP.wJpswEiJ76UzvtSLYZ1ucloKjFYZ.XW', 18, NULL, 'director', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 3),
(5, 'Alina', 'Kowalska', 'alina@example.com', '$2a$10$mPUwL7FlEtUANbg2so.iq.B8U5.PC4WDBo3N4hbJzruYuWbMN8AZS', 18, NULL, 'teacher', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 1),
(6, 'Elbieta', 'Stefańska', 'elastefa@example.com', '$2a$10$REEOzMSWVKYDO3e9ys2FouKHkoEHCtwMnvzTEhn8t4HLxMuyvEbgm', 18, NULL, 'teacher', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 1),
(7, 'Elbieta', 'Małecka', 'malek@example.com', '$2a$10$hIzO2Pc.5FLkWWvD5PuuAen80HUEWcd3DADZsQfwrO0DdR01slDK.', 18, NULL, 'teacher', '2024-04-08 10:42:23', '2024-04-08 10:42:23', 2),
(8, 'Kasia', 'Kasińska', 'student1@example.com', '$2a$10$SaBDfdTGZ5BG3DM3UD5V2OZsh0pO3QTVjr.1WtNrjQBL8UYmIeM5e', 18, NULL, 'student', '2024-04-08 10:42:23', '2024-04-08 10:42:23', NULL),
(9, 'Janusz', 'Wodnik', 'jwodnik@example.com', '$2a$10$k/cewvMXzyoOb1m0baSW4ORfBe1gC.Xvu2JyidaEyTmpXKgXjzrN2', 18, NULL, 'student', '2024-04-08 10:42:24', '2024-04-08 10:42:24', NULL),
(10, 'Karol', 'Karolski', 'kar@example.com', '$2a$10$XpIOiXs5txAemh/jD.ICoeDG7Oi85nFAkwExV0DvCkTtqh8nJjyjC', 18, NULL, 'student', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1),
(11, 'Władek', 'Włodzio', 'wladek@example.com', '$2a$10$rJcESOrsnNh2YL4j0E.4i.QsF8uJnjjtWCE8ZDa.s/r9FYAUKD5BG', 18, NULL, 'student', '2024-04-08 10:42:24', '2024-04-08 10:42:24', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `Grades`
--
ALTER TABLE `Grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subjectId` (`subjectId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `schoolId` (`schoolId`);

--
-- Indeksy dla tabeli `Schools`
--
ALTER TABLE `Schools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `directorId` (`directorId`);

--
-- Indeksy dla tabeli `Subjects`
--
ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schoolId` (`schoolId`),
  ADD KEY `teacherId` (`teacherId`);

--
-- Indeksy dla tabeli `SubjectUsers`
--
ALTER TABLE `SubjectUsers`
  ADD PRIMARY KEY (`subjectId`,`userId`);

--
-- Indeksy dla tabeli `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `schoolId` (`schoolId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Grades`
--
ALTER TABLE `Grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Schools`
--
ALTER TABLE `Schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Subjects`
--
ALTER TABLE `Subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Grades`
--
ALTER TABLE `Grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `Subjects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `grades_ibfk_3` FOREIGN KEY (`studentId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `grades_ibfk_4` FOREIGN KEY (`schoolId`) REFERENCES `Schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Schools`
--
ALTER TABLE `Schools`
  ADD CONSTRAINT `schools_ibfk_1` FOREIGN KEY (`directorId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Subjects`
--
ALTER TABLE `Subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`schoolId`) REFERENCES `Schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`schoolId`) REFERENCES `Schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
