-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TherapySession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
