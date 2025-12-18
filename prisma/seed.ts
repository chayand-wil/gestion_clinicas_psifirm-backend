import {
  AlcoholLevel,
  CivilStatus,
  ContractType,
  EducationLevel,
  Gender,
  PaymentType,
  Prisma,
  PrismaClient,
  Relationship,
  TagCategory,
  TobaccoLevel,
} from '@prisma/client';

const prisma = new PrismaClient();

// Hash de bcrypt para "admin123" pre-generado para evitar dependencias en el seed
const PASSWORD_HASH = '$2b$10$eASfv2odOZLb75sB6ueJWuAkqRgWyuLOEw77cqVnoRSvRnKjaAN7u';

const slugifyModule = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

async function seedRolesAndPermissions() {
  const rolesData = [
    { name: 'admin', description: 'Acceso total a la plataforma.' },
    { name: 'psicologo / terapeuta', description: 'Gestión clínica completa de sus pacientes.' },
    { name: 'psiquiatra', description: 'Gestión clínica y prescripciones.' },
    { name: 'recepcion', description: 'Gestión de pacientes y agenda diaria.' },
    { name: 'inventario / farmacia', description: 'Control de stock y entregas.' },
    { name: 'finanzas / contabilidad', description: 'Pagos, facturación y nómina.' },
    { name: 'recursos humanos', description: 'Gestión de usuarios y nómina.' },
    { name: 'paciente', description: 'Acceso limitado a su información y citas.' },
  ];

  const systemModules = [
    'Autenticación',
    'Usuarios',
    'Roles y Permisos',
    'Pacientes',
    'Historia Clínica',
    'Evaluación Inicial',
    'Diagnósticos',
    'Plan de Tratamiento',
    'Sesiones Terapéuticas',
    'Evaluaciones Periódicas',
    'Alta Terapéutica',
    'Agenda / Citas',
    'Prescripciones',
    'Inventario',
    'Facturación',
    'Pagos',
    'Nómina',
    'Reportes',
    'Auditoría',
  ];

  const actions = [
    { key: 'ver', description: 'Puede ver registros.' },
    { key: 'crear', description: 'Puede crear registros.' },
    { key: 'editar', description: 'Puede editar registros.' },
    { key: 'eliminar', description: 'Puede eliminar registros.' },
    { key: 'exportar', description: 'Puede exportar información.' },
    { key: 'firmar', description: 'Puede firmar digitalmente cuando aplique.' },
    { key: 'acceso_propio', description: 'Puede operar solo sobre sus registros.' },
    { key: 'acceso_total', description: 'Puede operar sobre todos los registros.' },
  ];

  const permissionsData = systemModules.flatMap((module) =>
    actions.map((action) => ({
      name: `${slugifyModule(module)}:${action.key}`,
      module,
      description: `${action.description} (${module})`,
    })),
  );

  const [roleRecords, permissionRecords] = await Promise.all([
    Promise.all(
      rolesData.map((role) =>
        prisma.role.upsert({
          where: { name: role.name },
          update: role,
          create: role,
        }),
      ),
    ),
    Promise.all(
      permissionsData.map((perm) =>
        prisma.permission.upsert({
          where: { name: perm.name },
          update: perm,
          create: perm,
        }),
      ),
    ),
  ]);

  const roleByName = new Map(roleRecords.map((role) => [role.name, role]));
  const permissionByName = new Map(permissionRecords.map((perm) => [perm.name, perm]));

  const permissionName = (module: string, actionKey: string) => `${slugifyModule(module)}:${actionKey}`;
  const pick = (modules: string[], actionKeys: string[]) =>
    modules.flatMap((module) => actionKeys.map((action) => permissionName(module, action)));

  const rolePermissionMatrix: Record<string, string[]> = {
    'Administrador del Sistema': permissionsData.map((perm) => perm.name),
    'Psicólogo / Terapeuta': pick(
      [
        'Pacientes',
        'Historia Clínica',
        'Evaluación Inicial',
        'Diagnósticos',
        'Plan de Tratamiento',
        'Sesiones Terapéuticas',
        'Evaluaciones Periódicas',
        'Alta Terapéutica',
        'Agenda / Citas',
        'Prescripciones',
        'Reportes',
      ],
      ['ver', 'crear', 'editar', 'firmar', 'acceso_propio'],
    ),
    Psiquiatra: pick(
      [
        'Pacientes',
        'Historia Clínica',
        'Diagnósticos',
        'Plan de Tratamiento',
        'Sesiones Terapéuticas',
        'Prescripciones',
        'Agenda / Citas',
        'Reportes',
      ],
      ['ver', 'crear', 'editar', 'firmar', 'acceso_propio'],
    ),
    Recepción: pick(['Pacientes', 'Agenda / Citas', 'Pagos'], ['ver', 'crear', 'editar', 'acceso_propio']),
    'Inventario / Farmacia': pick(['Inventario', 'Prescripciones'], ['ver', 'crear', 'editar', 'exportar', 'acceso_total']),
    'Finanzas / Contabilidad': pick(
      ['Facturación', 'Pagos', 'Nómina', 'Reportes', 'Auditoría'],
      ['ver', 'exportar', 'acceso_total'],
    ),
    'Recursos Humanos': pick(['Usuarios', 'Roles y Permisos', 'Nómina'], ['ver', 'crear', 'editar', 'acceso_total']),
    Paciente: pick(['Pacientes', 'Agenda / Citas', 'Pagos'], ['ver', 'crear', 'acceso_propio']),
  };

  for (const [roleName, permissions] of Object.entries(rolePermissionMatrix)) {
    const role = roleByName.get(roleName);
    if (!role) continue;

    for (const permName of permissions) {
      const perm = permissionByName.get(permName);
      if (!perm) continue;

      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  return { roleByName };
}

async function seedTags() {
  const tagsData = [
    // Temas
    { name: 'Ansiedad', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Depresión', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Duelo', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Estrés', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Trauma', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Autoestima', category: TagCategory.TEMA, description: 'Tema clínico base' },
    { name: 'Relaciones', category: TagCategory.TEMA, description: 'Tema clínico base' },

    // Intervenciones
    { name: 'Reestructuración cognitiva', category: TagCategory.INTERVENCION, description: 'Intervención terapéutica' },
    { name: 'Psicoeducación', category: TagCategory.INTERVENCION, description: 'Intervención terapéutica' },
    { name: 'Técnicas de respiración', category: TagCategory.INTERVENCION, description: 'Intervención terapéutica' },
    { name: 'Exposición gradual', category: TagCategory.INTERVENCION, description: 'Intervención terapéutica' },
    { name: 'Role-playing', category: TagCategory.INTERVENCION, description: 'Intervención terapéutica' },

    // Emociones
    { name: 'Tristeza', category: TagCategory.EMOCION, description: 'Emoción reportada' },
    { name: 'Ira', category: TagCategory.EMOCION, description: 'Emoción reportada' },
    { name: 'Miedo', category: TagCategory.EMOCION, description: 'Emoción reportada' },
    { name: 'Culpa', category: TagCategory.EMOCION, description: 'Emoción reportada' },
    { name: 'Alegría', category: TagCategory.EMOCION, description: 'Emoción reportada' },

    // Síntomas
    { name: 'Insomnio', category: TagCategory.SINTOMA, description: 'Síntoma clínico' },
    { name: 'Ataques de pánico', category: TagCategory.SINTOMA, description: 'Síntoma clínico' },
    { name: 'Ideación suicida', category: TagCategory.SINTOMA, description: 'Síntoma clínico' },
    { name: 'Fatiga', category: TagCategory.SINTOMA, description: 'Síntoma clínico' },
    { name: 'Irritabilidad', category: TagCategory.SINTOMA, description: 'Síntoma clínico' },

    // Otros (categorías sin enum específico)
    { name: 'Conducta', category: TagCategory.OTRO, description: 'Categoría genérica: Conducta' },
    { name: 'Evento Vital', category: TagCategory.OTRO, description: 'Categoría genérica: Evento vital' },
  ];

  await Promise.all(
    tagsData.map((tag) =>
      prisma.tag.upsert({
        where: { name: tag.name },
        update: tag,
        create: tag,
      }),
    ),
  );
}

async function seedSpecialtyAreas() {
  const areas = [
    { name: 'Psicología Clínica', description: 'Atención psicológica general.' },
    { name: 'Psiquiatría', description: 'Atención médica psiquiátrica.' },
    { name: 'Terapia Infantil', description: 'Intervenciones con niños.' },
    { name: 'Terapia Adolescente', description: 'Intervenciones con adolescentes.' },
    { name: 'Terapia de Pareja', description: 'Trabajo con parejas.' },
    { name: 'Terapia Familiar', description: 'Intervenciones sistémicas familiares.' },
    { name: 'Neuropsicología', description: 'Evaluación y rehabilitación cognitiva.' },
    { name: 'Psicopedagogía', description: 'Apoyo educativo y de aprendizaje.' },
    { name: 'Administración y Operaciones', description: 'Área para personal no clínico.' },
  ];

  const records = await Promise.all(
    areas.map((area) =>
      prisma.specialtyArea.upsert({
        where: { name: area.name },
        update: area,
        create: area,
      }),
    ),
  );

  return new Map(records.map((area) => [area.name, area]));
}

async function seedUsersAndPeople(roleByName: Map<string, { id: number }>, areaByName: Map<string, { id: number }>) {
  const baseUsers = [
    {
      email: 'admin@psifirm.test',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Principal',
      roles: ['admin'],
      employee: {
        area: 'Administración y Operaciones',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MENSUAL,
        baseSalary: '12000',
        sessionRate: '0',
      },
    },
    {
      email: 'psicologo@psifirm.test',
      username: 'psicologo.demo',
      firstName: 'Mariana',
      lastName: 'Lopez',
      roles: ['Psicólogo / Terapeuta'],
      employee: {
        area: 'Psicología Clínica',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MIXTO,
        baseSalary: '8500',
        sessionRate: '350',
        licenseNumber: 'PSI-CL-001',
      },
    },
    {
      email: 'psiquiatra@psifirm.test',
      username: 'psiquiatra.demo',
      firstName: 'Roberto',
      lastName: 'Paz',
      roles: ['Psiquiatra'],
      employee: {
        area: 'Psiquiatría',
        contractType: ContractType.SERVICIOS,
        paymentType: PaymentType.POR_SESION,
        baseSalary: '0',
        sessionRate: '600',
        licenseNumber: 'PSQ-002',
      },
    },
    {
      email: 'recepcion@psifirm.test',
      username: 'recepcion.demo',
      firstName: 'Lucia',
      lastName: 'Gomez',
      roles: ['Recepción'],
      employee: {
        area: 'Administración y Operaciones',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MENSUAL,
        baseSalary: '5000',
        sessionRate: '0',
      },
    },
    {
      email: 'inventario@psifirm.test',
      username: 'inventario.demo',
      firstName: 'Diego',
      lastName: 'Alvarez',
      roles: ['Inventario / Farmacia'],
      employee: {
        area: 'Administración y Operaciones',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MENSUAL,
        baseSalary: '5200',
        sessionRate: '0',
      },
    },
    {
      email: 'finanzas@psifirm.test',
      username: 'finanzas.demo',
      firstName: 'Karla',
      lastName: 'Juarez',
      roles: ['Finanzas / Contabilidad'],
      employee: {
        area: 'Administración y Operaciones',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MENSUAL,
        baseSalary: '7000',
        sessionRate: '0',
      },
    },
    {
      email: 'rrhh@psifirm.test',
      username: 'rrhh.demo',
      firstName: 'Carmen',
      lastName: 'Ruiz',
      roles: ['Recursos Humanos'],
      employee: {
        area: 'Administración y Operaciones',
        contractType: ContractType.INDEFINIDO,
        paymentType: PaymentType.MENSUAL,
        baseSalary: '6800',
        sessionRate: '0',
      },
    },
    {
      email: 'paciente@psifirm.test',
      username: 'paciente.demo',
      firstName: 'Paciente',
      lastName: 'Demo',
      roles: ['Paciente'],
      patient: {
        birthDate: new Date('1995-05-20'),
        gender: Gender.FEMENINO,
        civilStatus: CivilStatus.SOLTERO,
        occupation: 'Profesional',
        educationLevel: EducationLevel.UNIVERSITARIO,
        phone: '50255550000',
        emergencyName: 'Laura Demo',
        emergencyPhone: '50255551111',
        emergencyRelationship: Relationship.HERMANO,
        alcoholUse: AlcoholLevel.MODERADO,
        tobaccoUse: TobaccoLevel.BAJO,
      },
    },
  ];

  for (const userSeed of baseUsers) {
    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: {
        passwordHash: PASSWORD_HASH,
        isActive: true,
      },
      create: {
        email: userSeed.email,
        username: userSeed.username,
        passwordHash: PASSWORD_HASH,
        isActive: true,
      },
    });

    for (const roleName of userSeed.roles) {
      const role = roleByName.get(roleName);
      if (!role) continue;

      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }

    if (userSeed.employee) {
      const area = areaByName.get(userSeed.employee.area);
      if (!area) {
        throw new Error(`Área no encontrada para empleado: ${userSeed.employee.area}`);
      }

      await prisma.employee.upsert({
        where: { userId: user.id },
        update: {
          firstName: userSeed.firstName,
          lastName: userSeed.lastName,
          specialtyAreaId: area.id,
          contractType: userSeed.employee.contractType,
          paymentType: userSeed.employee.paymentType,
          baseSalary: new Prisma.Decimal(userSeed.employee.baseSalary),
          sessionRate: new Prisma.Decimal(userSeed.employee.sessionRate),
          licenseNumber: userSeed.employee.licenseNumber,
        },
        create: {
          userId: user.id,
          firstName: userSeed.firstName,
          lastName: userSeed.lastName,
          specialtyAreaId: area.id,
          contractType: userSeed.employee.contractType,
          paymentType: userSeed.employee.paymentType,
          baseSalary: new Prisma.Decimal(userSeed.employee.baseSalary),
          sessionRate: new Prisma.Decimal(userSeed.employee.sessionRate),
          licenseNumber: userSeed.employee.licenseNumber,
          isActive: true,
        },
      });
    }

    if (userSeed.patient) {
      await prisma.patient.upsert({
        where: { userId: user.id },
        update: {
          firstName: userSeed.firstName,
          lastName: userSeed.lastName,
          birthDate: userSeed.patient.birthDate,
          gender: userSeed.patient.gender,
          civilStatus: userSeed.patient.civilStatus,
          occupation: userSeed.patient.occupation,
          educationLevel: userSeed.patient.educationLevel,
          phone: userSeed.patient.phone,
          email: userSeed.email,
          address: 'Ciudad de Guatemala',
          emergencyName: userSeed.patient.emergencyName,
          emergencyPhone: userSeed.patient.emergencyPhone,
          emergencyRelationship: userSeed.patient.emergencyRelationship,
          alcoholUse: userSeed.patient.alcoholUse,
          tobaccoUse: userSeed.patient.tobaccoUse,
          isActive: true,
        },
        create: {
          userId: user.id,
          firstName: userSeed.firstName,
          lastName: userSeed.lastName,
          birthDate: userSeed.patient.birthDate,
          gender: userSeed.patient.gender,
          civilStatus: userSeed.patient.civilStatus,
          occupation: userSeed.patient.occupation,
          educationLevel: userSeed.patient.educationLevel,
          phone: userSeed.patient.phone,
          email: userSeed.email,
          address: 'Ciudad de Guatemala',
          emergencyName: userSeed.patient.emergencyName,
          emergencyPhone: userSeed.patient.emergencyPhone,
          emergencyRelationship: userSeed.patient.emergencyRelationship,
          alcoholUse: userSeed.patient.alcoholUse,
          tobaccoUse: userSeed.patient.tobaccoUse,
          isActive: true,
        },
      });
    }
  }
}

async function main() {
  const { roleByName } = await seedRolesAndPermissions();
  await seedTags();
  const areaByName = await seedSpecialtyAreas();
  await seedUsersAndPeople(roleByName, areaByName);
}

main()
  .catch((error) => {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });