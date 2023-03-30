/*
  Warnings:

  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `classes` DROP FOREIGN KEY `Classes_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `classmate` DROP FOREIGN KEY `ClassMate_classId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_classId_fkey`;

-- DropTable
DROP TABLE `classes`;

-- CreateTable
CREATE TABLE `Kelas` (
    `id` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassMate` ADD CONSTRAINT `ClassMate_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Kelas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelas` ADD CONSTRAINT `Kelas_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Kelas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
