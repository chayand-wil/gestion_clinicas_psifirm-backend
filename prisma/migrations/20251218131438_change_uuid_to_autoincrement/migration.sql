/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `patientId` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `employeeId` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `sessionId` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `AuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `AuditLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `AuditLog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Diagnosis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Diagnosis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `Diagnosis` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `DiagnosisDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `DiagnosisDetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `DiagnosisDetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `specialtyAreaId` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `EmployeeSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `EmployeeSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `employeeId` on the `EmployeeSchedule` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `InitialAssessment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `InitialAssessment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `InitialAssessment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `InventoryMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `InventoryMovement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `productId` on the `InventoryMovement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `paymentId` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `InvoiceItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `invoiceId` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MedicalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MedicalRecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `patientId` on the `MedicalRecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `psychologistId` on the `MedicalRecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `specialtyAreaId` on the `MedicalRecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `patientId` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Payroll` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Payroll` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `employeeId` on the `Payroll` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `PeriodicEvaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PeriodicEvaluation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `PeriodicEvaluation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Permission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Prescription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Prescription` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `Prescription` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `productId` on the `Prescription` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `prescribedBy` on the `Prescription` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `PrescriptionDelivery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PrescriptionDelivery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `prescriptionId` on the `PrescriptionDelivery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `deliveredBy` on the `PrescriptionDelivery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `PsychologicalTest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `PsychologicalTest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `PsychologicalTest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `roleId` on the `RolePermission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `permissionId` on the `RolePermission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `SessionTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `sessionId` on the `SessionTag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `tagId` on the `SessionTag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `SpecialtyArea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `SpecialtyArea` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Tag` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `TherapeuticDischarge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TherapeuticDischarge` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `TherapeuticDischarge` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `TherapySession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TherapySession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `TherapySession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `employeeId` on the `TherapySession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `TreatmentPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TreatmentPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `recordId` on the `TreatmentPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userId` on the `UserRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `roleId` on the `UserRole` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `AuditLog` DROP FOREIGN KEY `AuditLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Diagnosis` DROP FOREIGN KEY `Diagnosis_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `DiagnosisDetail` DROP FOREIGN KEY `DiagnosisDetail_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_specialtyAreaId_fkey`;

-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EmployeeSchedule` DROP FOREIGN KEY `EmployeeSchedule_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `InitialAssessment` DROP FOREIGN KEY `InitialAssessment_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryMovement` DROP FOREIGN KEY `InventoryMovement_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_invoiceId_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalRecord` DROP FOREIGN KEY `MedicalRecord_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalRecord` DROP FOREIGN KEY `MedicalRecord_psychologistId_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalRecord` DROP FOREIGN KEY `MedicalRecord_specialtyAreaId_fkey`;

-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `Payroll` DROP FOREIGN KEY `Payroll_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `PeriodicEvaluation` DROP FOREIGN KEY `PeriodicEvaluation_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `Prescription` DROP FOREIGN KEY `Prescription_prescribedBy_fkey`;

-- DropForeignKey
ALTER TABLE `Prescription` DROP FOREIGN KEY `Prescription_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Prescription` DROP FOREIGN KEY `Prescription_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `PrescriptionDelivery` DROP FOREIGN KEY `PrescriptionDelivery_deliveredBy_fkey`;

-- DropForeignKey
ALTER TABLE `PrescriptionDelivery` DROP FOREIGN KEY `PrescriptionDelivery_prescriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `PsychologicalTest` DROP FOREIGN KEY `PsychologicalTest_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `RolePermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `SessionTag` DROP FOREIGN KEY `SessionTag_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `SessionTag` DROP FOREIGN KEY `SessionTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `TherapeuticDischarge` DROP FOREIGN KEY `TherapeuticDischarge_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `TherapySession` DROP FOREIGN KEY `TherapySession_employeeId_fkey`;

-- DropForeignKey
ALTER TABLE `TherapySession` DROP FOREIGN KEY `TherapySession_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `TreatmentPlan` DROP FOREIGN KEY `TreatmentPlan_recordId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropIndex
DROP INDEX `Appointment_employeeId_fkey` ON `Appointment`;

-- DropIndex
DROP INDEX `Appointment_patientId_fkey` ON `Appointment`;

-- DropIndex
DROP INDEX `AuditLog_userId_fkey` ON `AuditLog`;

-- DropIndex
DROP INDEX `Diagnosis_recordId_fkey` ON `Diagnosis`;

-- DropIndex
DROP INDEX `Employee_specialtyAreaId_fkey` ON `Employee`;

-- DropIndex
DROP INDEX `EmployeeSchedule_employeeId_fkey` ON `EmployeeSchedule`;

-- DropIndex
DROP INDEX `InventoryMovement_productId_fkey` ON `InventoryMovement`;

-- DropIndex
DROP INDEX `InvoiceItem_invoiceId_fkey` ON `InvoiceItem`;

-- DropIndex
DROP INDEX `MedicalRecord_psychologistId_fkey` ON `MedicalRecord`;

-- DropIndex
DROP INDEX `MedicalRecord_specialtyAreaId_fkey` ON `MedicalRecord`;

-- DropIndex
DROP INDEX `Payment_patientId_fkey` ON `Payment`;

-- DropIndex
DROP INDEX `Payroll_employeeId_fkey` ON `Payroll`;

-- DropIndex
DROP INDEX `PeriodicEvaluation_recordId_fkey` ON `PeriodicEvaluation`;

-- DropIndex
DROP INDEX `Prescription_prescribedBy_fkey` ON `Prescription`;

-- DropIndex
DROP INDEX `Prescription_productId_fkey` ON `Prescription`;

-- DropIndex
DROP INDEX `Prescription_recordId_fkey` ON `Prescription`;

-- DropIndex
DROP INDEX `PrescriptionDelivery_deliveredBy_fkey` ON `PrescriptionDelivery`;

-- DropIndex
DROP INDEX `PrescriptionDelivery_prescriptionId_fkey` ON `PrescriptionDelivery`;

-- DropIndex
DROP INDEX `PsychologicalTest_recordId_fkey` ON `PsychologicalTest`;

-- DropIndex
DROP INDEX `RolePermission_permissionId_fkey` ON `RolePermission`;

-- DropIndex
DROP INDEX `TherapySession_employeeId_fkey` ON `TherapySession`;

-- DropIndex
DROP INDEX `UserRole_roleId_fkey` ON `UserRole`;

-- AlterTable
ALTER TABLE `Appointment` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `patientId` INTEGER NOT NULL,
    MODIFY `employeeId` INTEGER NOT NULL,
    MODIFY `sessionId` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `AuditLog` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Diagnosis` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `DiagnosisDetail` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Employee` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `specialtyAreaId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `EmployeeSchedule` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `employeeId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `InitialAssessment` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `InventoryMovement` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `productId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Invoice` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `paymentId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `InvoiceItem` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `invoiceId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MedicalRecord` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `patientId` INTEGER NOT NULL,
    MODIFY `psychologistId` INTEGER NOT NULL,
    MODIFY `specialtyAreaId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Patient` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Payment` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `patientId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Payroll` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `employeeId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PeriodicEvaluation` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Permission` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Prescription` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    MODIFY `productId` INTEGER NOT NULL,
    MODIFY `prescribedBy` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PrescriptionDelivery` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `prescriptionId` INTEGER NOT NULL,
    MODIFY `deliveredBy` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PsychologicalTest` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Role` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `RolePermission` DROP PRIMARY KEY,
    MODIFY `roleId` INTEGER NOT NULL,
    MODIFY `permissionId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`roleId`, `permissionId`);

-- AlterTable
ALTER TABLE `SessionTag` DROP PRIMARY KEY,
    MODIFY `sessionId` INTEGER NOT NULL,
    MODIFY `tagId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`sessionId`, `tagId`);

-- AlterTable
ALTER TABLE `SpecialtyArea` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Tag` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TherapeuticDischarge` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TherapySession` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    MODIFY `employeeId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `TreatmentPlan` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `recordId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserRole` DROP PRIMARY KEY,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `roleId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `roleId`);

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_specialtyAreaId_fkey` FOREIGN KEY (`specialtyAreaId`) REFERENCES `SpecialtyArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSchedule` ADD CONSTRAINT `EmployeeSchedule_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_psychologistId_fkey` FOREIGN KEY (`psychologistId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalRecord` ADD CONSTRAINT `MedicalRecord_specialtyAreaId_fkey` FOREIGN KEY (`specialtyAreaId`) REFERENCES `SpecialtyArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InitialAssessment` ADD CONSTRAINT `InitialAssessment_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PsychologicalTest` ADD CONSTRAINT `PsychologicalTest_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnosis` ADD CONSTRAINT `Diagnosis_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiagnosisDetail` ADD CONSTRAINT `DiagnosisDetail_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreatmentPlan` ADD CONSTRAINT `TreatmentPlan_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapySession` ADD CONSTRAINT `TherapySession_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapySession` ADD CONSTRAINT `TherapySession_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionTag` ADD CONSTRAINT `SessionTag_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `TherapySession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionTag` ADD CONSTRAINT `SessionTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeriodicEvaluation` ADD CONSTRAINT `PeriodicEvaluation_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapeuticDischarge` ADD CONSTRAINT `TherapeuticDischarge_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryMovement` ADD CONSTRAINT `InventoryMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `MedicalRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_prescribedBy_fkey` FOREIGN KEY (`prescribedBy`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionDelivery` ADD CONSTRAINT `PrescriptionDelivery_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionDelivery` ADD CONSTRAINT `PrescriptionDelivery_deliveredBy_fkey` FOREIGN KEY (`deliveredBy`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
