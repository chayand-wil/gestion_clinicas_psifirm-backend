/*
  Warnings:

  - You are about to drop the column `recordId` on the `DiagnosisDetail` table. All the data in the column will be lost.
  - Added the required column `diagnosisId` to the `DiagnosisDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DiagnosisDetail` DROP FOREIGN KEY `DiagnosisDetail_recordId_fkey`;

-- DropIndex
DROP INDEX `DiagnosisDetail_recordId_key` ON `DiagnosisDetail`;

-- AlterTable
ALTER TABLE `DiagnosisDetail` DROP COLUMN `recordId`,
    ADD COLUMN `diagnosisId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `DiagnosisDetail` ADD CONSTRAINT `DiagnosisDetail_diagnosisId_fkey` FOREIGN KEY (`diagnosisId`) REFERENCES `Diagnosis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
