export class Usuario {
  id: bigint;
  nombre?: string;
  apellido?: string;
  mail?: string;
  nit?: string;
  telefono?: string;
  municipioId?: number;
  departamentoId?: number;
  detalle?: string;
  isAnonymous: boolean;
  tokenSesion?: string;
  passwordHash?: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn?: Date;
  deletedAt?: Date;
}
