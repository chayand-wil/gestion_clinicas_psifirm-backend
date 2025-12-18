/*
  Warnings:

  - You are about to drop the `articulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articulo_media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articulo_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estado_articulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facturacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lista_deseos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lista_deseos_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medio_tipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `municipio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `articulo` DROP FOREIGN KEY `articulo_categoria_id_fkey`;

-- DropForeignKey
ALTER TABLE `articulo` DROP FOREIGN KEY `articulo_estado_id_fkey`;

-- DropForeignKey
ALTER TABLE `articulo` DROP FOREIGN KEY `articulo_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `articulo_media` DROP FOREIGN KEY `articulo_media_id_articulo_fkey`;

-- DropForeignKey
ALTER TABLE `articulo_media` DROP FOREIGN KEY `articulo_media_tipo_id_fkey`;

-- DropForeignKey
ALTER TABLE `articulo_tag` DROP FOREIGN KEY `articulo_tag_id_articulo_fkey`;

-- DropForeignKey
ALTER TABLE `articulo_tag` DROP FOREIGN KEY `articulo_tag_id_tag_fkey`;

-- DropForeignKey
ALTER TABLE `detalle_pedido` DROP FOREIGN KEY `detalle_pedido_id_articulo_fkey`;

-- DropForeignKey
ALTER TABLE `detalle_pedido` DROP FOREIGN KEY `detalle_pedido_id_pedido_fkey`;

-- DropForeignKey
ALTER TABLE `facturacion` DROP FOREIGN KEY `facturacion_id_pedido_fkey`;

-- DropForeignKey
ALTER TABLE `facturacion` DROP FOREIGN KEY `facturacion_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `lista_deseos` DROP FOREIGN KEY `lista_deseos_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `lista_deseos_items` DROP FOREIGN KEY `lista_deseos_items_id_articulo_fkey`;

-- DropForeignKey
ALTER TABLE `lista_deseos_items` DROP FOREIGN KEY `lista_deseos_items_id_lista_fkey`;

-- DropForeignKey
ALTER TABLE `municipio` DROP FOREIGN KEY `municipio_departamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `pedido_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_departamento_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_municipio_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_role_id_fkey`;

-- DropTable
DROP TABLE `articulo`;

-- DropTable
DROP TABLE `articulo_media`;

-- DropTable
DROP TABLE `articulo_tag`;

-- DropTable
DROP TABLE `categoria`;

-- DropTable
DROP TABLE `departamento`;

-- DropTable
DROP TABLE `detalle_pedido`;

-- DropTable
DROP TABLE `estado_articulo`;

-- DropTable
DROP TABLE `facturacion`;

-- DropTable
DROP TABLE `lista_deseos`;

-- DropTable
DROP TABLE `lista_deseos_items`;

-- DropTable
DROP TABLE `medio_tipo`;

-- DropTable
DROP TABLE `municipio`;

-- DropTable
DROP TABLE `pedido`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `tag`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,
    `recoveryToken` VARCHAR(191) NULL,
    `recoveryExpiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `userId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecialtyArea` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `SpecialtyArea_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `licenseNumber` VARCHAR(191) NULL,
    `specialtyAreaId` VARCHAR(191) NOT NULL,
    `contractType` ENUM('INDEFINIDO', 'TEMPORAL', 'SERVICIOS') NOT NULL,
    `paymentType` ENUM('MENSUAL', 'POR_SESION', 'MIXTO') NOT NULL,
    `baseSalary` DECIMAL(10, 2) NOT NULL,
    `sessionRate` DECIMAL(8, 2) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Employee_userId_key`(`userId`),
    UNIQUE INDEX `Employee_licenseNumber_key`(`licenseNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `dayOfWeek` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO') NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `gender` ENUM('MASCULINO', 'FEMENINO', 'NO_BINARIO', 'PREFIERO_NO_ESPECIFICAR') NOT NULL,
    `civilStatus` ENUM('SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'UNION_LIBRE') NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `educationLevel` ENUM('PRIMARIA', 'SECUNDARIA', 'DIVERSIFICADO', 'TECNICO', 'UNIVERSITARIO', 'POSTGRADO') NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `emergencyName` VARCHAR(191) NOT NULL,
    `emergencyPhone` VARCHAR(191) NOT NULL,
    `emergencyRelationship` ENUM('PADRE', 'MADRE', 'HIJO', 'CONYUGE', 'HERMANO', 'OTRO') NOT NULL,
    `alcoholUse` ENUM('NINGUNO', 'BAJO', 'MODERADO', 'ALTO') NOT NULL,
    `tobaccoUse` ENUM('NINGUNO', 'BAJO', 'MODERADO', 'ALTO') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Patient_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalRecord` (
    `id` VARCHAR(191) NOT NULL,
    `recordNumber` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `psychologistId` VARCHAR(191) NOT NULL,
    `specialtyAreaId` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVA', 'CERRADA', 'SUSPENDIDA') NOT NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `openedAt` DATETIME(3) NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MedicalRecord_recordNumber_key`(`recordNumber`),
    INDEX `MedicalRecord_patientId_isCurrent_idx`(`patientId`, `isCurrent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InitialAssessment` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `referralSource` VARCHAR(191) NOT NULL,
    `consultationReason` TEXT NOT NULL,
    `familyHistory` TEXT NOT NULL,
    `personalHistory` TEXT NOT NULL,
    `developmentalHistory` TEXT NULL,
    `academicHistory` TEXT NULL,
    `medicalHistory` TEXT NULL,
    `currentMedication` TEXT NULL,
    `drugConsumption` TEXT NULL,
    `previousTreatment` BOOLEAN NOT NULL DEFAULT false,
    `previousTreatmentDetails` TEXT NULL,
    `hospitalizations` BOOLEAN NOT NULL DEFAULT false,
    `hospitalizationDetails` TEXT NULL,
    `moodLevel` INTEGER NOT NULL,
    `anxietyLevel` INTEGER NOT NULL,
    `socialFunction` INTEGER NOT NULL,
    `sleepQuality` INTEGER NOT NULL,
    `appetite` INTEGER NOT NULL,
    `generalObservations` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InitialAssessment_recordId_key`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PsychologicalTest` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `score` VARCHAR(191) NOT NULL,
    `interpretation` TEXT NOT NULL,
    `appliedAt` DATETIME(3) NOT NULL,
    `attachmentUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnosis` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `cie11Code` VARCHAR(191) NOT NULL,
    `type` ENUM('PRINCIPAL', 'SECUNDARIO') NOT NULL,
    `description` TEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiagnosisDetail` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `predisponentes` TEXT NOT NULL,
    `precipitantes` TEXT NOT NULL,
    `mantenedores` TEXT NOT NULL,
    `functioningLevel` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DiagnosisDetail_recordId_key`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreatmentPlan` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `shortTermGoal` TEXT NOT NULL,
    `mediumTermGoal` TEXT NULL,
    `longTermGoal` TEXT NULL,
    `modality` ENUM('INDIVIDUAL', 'FAMILIAR', 'PAREJA', 'GRUPAL') NOT NULL,
    `therapeuticFocus` ENUM('COGNITIVO_CONDUCTUAL', 'SISTEMICO', 'PSICODINAMICO', 'HUMANISTA', 'INTEGRATIVO', 'OTRO') NOT NULL,
    `frequency` ENUM('SEMANAL', 'QUINCENAL', 'MENSUAL', 'OTRO') NOT NULL,
    `sessionsPerWeek` INTEGER NOT NULL DEFAULT 1,
    `estimatedWeeks` INTEGER NULL,
    `costPerSession` DECIMAL(8, 2) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estimatedEndDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TreatmentPlan_recordId_key`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapySession` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `sessionNumber` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `attended` BOOLEAN NOT NULL,
    `absenceReason` TEXT NULL,
    `interventions` TEXT NOT NULL,
    `patientResponse` TEXT NOT NULL,
    `assignedTasks` TEXT NOT NULL,
    `observations` TEXT NOT NULL,
    `nextSessionDate` DATETIME(3) NULL,
    `digitalSignature` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TherapySession_recordId_sessionNumber_key`(`recordId`, `sessionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('TEMA', 'INTERVENCION', 'EMOCION', 'SINTOMA', 'OTRO') NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SessionTag` (
    `sessionId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SessionTag_tagId_idx`(`tagId`),
    PRIMARY KEY (`sessionId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PeriodicEvaluation` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `type` ENUM('INICIAL', 'SEGUIMIENTO', 'FINAL') NOT NULL,
    `observedProgress` TEXT NOT NULL,
    `achievedGoals` TEXT NOT NULL,
    `pendingGoals` TEXT NOT NULL,
    `recommendations` TEXT NOT NULL,
    `progressScale` INTEGER NOT NULL,
    `evaluatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapeuticDischarge` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `dischargeDate` DATETIME(3) NOT NULL,
    `reason` ENUM('OBJETIVOS_ALCANZADOS', 'ABANDONO', 'DERIVACION', 'OTRO') NOT NULL,
    `patientStatus` TEXT NOT NULL,
    `recommendations` TEXT NOT NULL,
    `followUpPlan` TEXT NULL,
    `patientSignature` TEXT NULL,
    `therapistSignature` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TherapeuticDischarge_recordId_key`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `minStock` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `isMedication` BOOLEAN NOT NULL,

    UNIQUE INDEX `Product_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryMovement` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'VENCIMIENTO') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `id` VARCHAR(191) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `prescribedBy` VARCHAR(191) NOT NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `instructions` VARCHAR(191) NOT NULL,
    `prescriptionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrescriptionDelivery` (
    `id` VARCHAR(191) NOT NULL,
    `prescriptionId` VARCHAR(191) NOT NULL,
    `deliveredBy` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `deliveredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO') NOT NULL,
    `cost` DECIMAL(8, 2) NOT NULL,
    `sessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Appointment_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO') NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `issueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `taxes` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_number_key`(`number`),
    UNIQUE INDEX `Invoice_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payroll` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `baseSalary` DECIMAL(10, 2) NOT NULL,
    `bonus` DECIMAL(10, 2) NOT NULL,
    `igss` DECIMAL(10, 2) NOT NULL,
    `deductions` DECIMAL(10, 2) NOT NULL,
    `netSalary` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDIENTE', 'PAGADO', 'CANCELADO') NOT NULL,
    `paymentDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ACCESS') NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `oldData` JSON NULL,
    `newData` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
