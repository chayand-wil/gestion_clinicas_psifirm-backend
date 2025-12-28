-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `appointmentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
