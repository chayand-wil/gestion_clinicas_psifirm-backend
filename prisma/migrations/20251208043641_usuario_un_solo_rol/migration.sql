/*
  Warnings:

  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_id_role_fkey`;

-- DropForeignKey
ALTER TABLE `user_role` DROP FOREIGN KEY `user_role_id_user_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role_id` INTEGER NULL;

-- DropTable
DROP TABLE `user_role`;

-- CreateIndex
CREATE INDEX `user_role_id_idx` ON `user`(`role_id`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id_role`) ON DELETE SET NULL ON UPDATE CASCADE;
