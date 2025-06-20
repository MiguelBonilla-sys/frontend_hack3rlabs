import { ReactNode } from 'react';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  pk?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginResponse {
  key: string;
  user: User;
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: User | null;
}

export interface Curso {
  idcursos: number;
  nombre_curso: string;
  fechainicial_curso?: string;
  fechafinal_curso?: string;
  link_curso: string;
  descripcion_curso: string;
  creador: number;
  modalidad_curso?: string;
  duracion_curso?: number;
  estado_curso?: boolean;
}

export interface Noticia {
  idnoticia: number;
  nombre_noticia: string;
  fecha_noticia: string;
  link_noticia: string;
  description_noticia: string;
  creador: number;
  fuente?: string;
  imagen_noticia: string;
  categoria?: string;
  autor?: string;
  contenido?: string;
}

export interface Proyecto {
  idproyectos: number;
  nombre_proyecto: string;
  fecha_proyecto: string;
  link_proyecto: string;
  description_proyecto: string;
  creador: number;
  integrantes: number[];
}

export interface Integrante {
  idintegrantes: number;
  nombre_integrante: string;
  semestre: string;
  correo: string;
  link_git: string;
  imagen: string;
  creador: number;
  estado: boolean;
  reseña: string;
}

export interface OfertaEmpleo {
  idoferta: number;
  titulo_empleo: string;
  empresa: string;
  descripcion_empleo: string;
  fecha_publicacion: string;
  fecha_expiracion?: string;
  salario_min?: number;
  salario_max?: number;
  ubicacion: string;
  modalidad: 'presencial' | 'remoto' | 'hibrido';
  imagen: string;
  creador: number;
  link_oferta?: string;
}

export interface Conferencia {
  idconferencia: number;
  nombre_conferencia: string;
  ponente_conferencia: string;
  fecha_conferencia: string;
  descripcion_conferencia: string;
  imagen_conferencia: string;
  link_conferencia: string;
  creador: number;
}

export interface AuditLog {
  id: number;
  usuario: string;
  accion: string;
  modelo: string;
  fecha: string;
  detalles: string;
  ip: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface Column<T> {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
}

export interface UserPermissions {
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface Permissions {
  [key: string]: UserPermissions;
}
