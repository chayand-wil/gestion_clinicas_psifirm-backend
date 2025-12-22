-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_specialtyAreaId_fkey`;

-- DropIndex
DROP INDEX `Employee_specialtyAreaId_fkey` ON `Employee`;

-- AlterTable
ALTER TABLE `Employee` MODIFY `specialtyAreaId` INTEGER NULL,
    MODIFY `contractType` ENUM('INDEFINIDO', 'TEMPORAL', 'SERVICIOS') NULL,
    MODIFY `paymentType` ENUM('MENSUAL', 'POR_SESION', 'MIXTO') NULL,
    MODIFY `baseSalary` DECIMAL(10, 2) NULL,
    MODIFY `sessionRate` DECIMAL(8, 2) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_specialtyAreaId_fkey` FOREIGN KEY (`specialtyAreaId`) REFERENCES `SpecialtyArea`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
