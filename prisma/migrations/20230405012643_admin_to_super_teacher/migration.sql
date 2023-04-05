/*
  Warnings:

  - The values [ADMIN] on the enum `User_level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `level` ENUM('SUPER_TEACHER', 'TEACHER', 'STUDENT') NOT NULL;
