-- CreateTable
CREATE TABLE `departamento` (
    `id_departamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `departamento_slug_key`(`slug`),
    PRIMARY KEY (`id_departamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipio` (
    `id_municipio` INTEGER NOT NULL AUTO_INCREMENT,
    `departamento_id` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id_municipio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id_role` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `role_nombre_key`(`nombre`),
    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(150) NULL,
    `descripcion` TEXT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_articulo` (
    `id_estado_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(60) NOT NULL,
    `descripcion` TEXT NULL,

    UNIQUE INDEX `estado_articulo_nombre_key`(`nombre`),
    PRIMARY KEY (`id_estado_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medio_tipo` (
    `id_medio_tipo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `medio_tipo_nombre_key`(`nombre`),
    PRIMARY KEY (`id_medio_tipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id_tag` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `tag_nombre_key`(`nombre`),
    PRIMARY KEY (`id_tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` BIGINT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NULL,
    `apellido` VARCHAR(120) NULL,
    `mail` VARCHAR(150) NULL,
    `nit` VARCHAR(50) NULL,
    `telefono` VARCHAR(40) NULL,
    `municipio_id` INTEGER NULL,
    `departamento_id` INTEGER NULL,
    `detalle` TEXT NULL,
    `is_anonymous` BOOLEAN NOT NULL DEFAULT true,
    `token_sesion` VARCHAR(200) NULL,
    `password_hash` VARCHAR(255) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_mail_key`(`mail`),
    UNIQUE INDEX `user_token_sesion_key`(`token_sesion`),
    INDEX `user_municipio_id_idx`(`municipio_id`),
    INDEX `user_departamento_id_idx`(`departamento_id`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `id_user` BIGINT NOT NULL,
    `id_role` INTEGER NOT NULL,

    PRIMARY KEY (`id_user`, `id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulo` (
    `id_articulo` BIGINT NOT NULL AUTO_INCREMENT,
    `usuario_id` BIGINT NULL,
    `nombre` VARCHAR(180) NOT NULL,
    `slug` VARCHAR(210) NULL,
    `descripcion` TEXT NULL,
    `detalles` JSON NULL,
    `precio_compra` DECIMAL(12, 2) NULL,
    `precio_venta` DECIMAL(12, 2) NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 0,
    `categoria_id` INTEGER NULL,
    `estado_id` INTEGER NULL,
    `visibilidad` ENUM('publico', 'privado', 'oculto') NOT NULL DEFAULT 'publico',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `articulo_nombre_idx`(`nombre`),
    INDEX `articulo_categoria_id_idx`(`categoria_id`),
    PRIMARY KEY (`id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulo_media` (
    `id_media` BIGINT NOT NULL AUTO_INCREMENT,
    `id_articulo` BIGINT NOT NULL,
    `url` VARCHAR(1000) NOT NULL,
    `tipo_id` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 1,
    `metadata` JSON NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_media`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulo_tag` (
    `id_articulo` BIGINT NOT NULL,
    `id_tag` INTEGER NOT NULL,

    PRIMARY KEY (`id_articulo`, `id_tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `id_pedido` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT NULL,
    `token_cliente` VARCHAR(200) NULL,
    `estado` ENUM('carrito', 'pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'carrito',
    `total` DECIMAL(12, 2) NULL,
    `direccion_envio` TEXT NULL,
    `metodo_pago` VARCHAR(80) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NULL,

    INDEX `pedido_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_pedido` (
    `id_detalle` BIGINT NOT NULL AUTO_INCREMENT,
    `id_pedido` BIGINT NOT NULL,
    `id_articulo` BIGINT NOT NULL,
    `precio_unitario` DECIMAL(12, 2) NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `detalle_pedido_id_pedido_idx`(`id_pedido`),
    PRIMARY KEY (`id_detalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facturacion` (
    `id_factura` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT NULL,
    `id_pedido` BIGINT NOT NULL,
    `numero_factura` VARCHAR(100) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,
    `impuesto` DECIMAL(12, 2) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `facturacion_id_pedido_key`(`id_pedido`),
    UNIQUE INDEX `facturacion_numero_factura_key`(`numero_factura`),
    PRIMARY KEY (`id_factura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lista_deseos` (
    `id_lista` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT NOT NULL,
    `nombre_lista` VARCHAR(150) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lista_deseos_id_user_idx`(`id_user`),
    PRIMARY KEY (`id_lista`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lista_deseos_items` (
    `id_lista` BIGINT NOT NULL,
    `id_articulo` BIGINT NOT NULL,
    `agregado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_lista`, `id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `municipio` ADD CONSTRAINT `municipio_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `departamento`(`id_departamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_municipio_id_fkey` FOREIGN KEY (`municipio_id`) REFERENCES `municipio`(`id_municipio`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_departamento_id_fkey` FOREIGN KEY (`departamento_id`) REFERENCES `departamento`(`id_departamento`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `role`(`id_role`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo` ADD CONSTRAINT `articulo_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `user`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo` ADD CONSTRAINT `articulo_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo` ADD CONSTRAINT `articulo_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `estado_articulo`(`id_estado_articulo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo_media` ADD CONSTRAINT `articulo_media_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `articulo`(`id_articulo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo_media` ADD CONSTRAINT `articulo_media_tipo_id_fkey` FOREIGN KEY (`tipo_id`) REFERENCES `medio_tipo`(`id_medio_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo_tag` ADD CONSTRAINT `articulo_tag_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `articulo`(`id_articulo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulo_tag` ADD CONSTRAINT `articulo_tag_id_tag_fkey` FOREIGN KEY (`id_tag`) REFERENCES `tag`(`id_tag`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_pedido` ADD CONSTRAINT `detalle_pedido_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_pedido` ADD CONSTRAINT `detalle_pedido_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `articulo`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturacion` ADD CONSTRAINT `facturacion_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturacion` ADD CONSTRAINT `facturacion_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lista_deseos` ADD CONSTRAINT `lista_deseos_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lista_deseos_items` ADD CONSTRAINT `lista_deseos_items_id_lista_fkey` FOREIGN KEY (`id_lista`) REFERENCES `lista_deseos`(`id_lista`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lista_deseos_items` ADD CONSTRAINT `lista_deseos_items_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `articulo`(`id_articulo`) ON DELETE CASCADE ON UPDATE CASCADE;
