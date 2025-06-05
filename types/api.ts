export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ModelPermissions {
  view: boolean;
  add: boolean;
  change: boolean;
  delete: boolean;
}

export type PermissionModels = 'conferencias' | 'cursos' | 'noticias' | 'integrantes' | 'proyectos' | 'ofertas' | 'auditlog' | 'users' | 'groups';

export type UserPermissions = {
  [key in PermissionModels]?: ModelPermissions;
};

export interface User {
  id?: number; // Para compatibilidad con el código existente
  pk?: number; // Estructura de Railway
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean; // Puede no estar presente en Railway
  is_superuser?: boolean; // Puede no estar presente en Railway
  permissions?: UserPermissions;
}

export interface LoginResponse {
  key: string;
  user: User;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user?: User;
}

export interface Curso extends Record<string, unknown> {
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

export interface Noticia extends Record<string, unknown> {
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

export interface Proyecto extends Record<string, unknown> {
  idproyectos: number;
  nombre_proyecto: string;
  fecha_proyecto: string;
  link_proyecto: string;
  description_proyecto: string;
  creador: number;
  integrantes: number[];
}

export interface Integrante extends Record<string, unknown> {
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

export interface OfertaEmpleo extends Record<string, unknown> {
  idoferta: number;
  titulo_empleo: string;
  empresa: string;
  descripcion_empleo: string;
  fecha_publicacion: string;
  fecha_expiracion?: string;
  imagen: string;
  link_oferta: string;
  creador: number;
}

export interface Conferencia extends Record<string, unknown> {
  idconferencia: number;
  nombre_conferencia: string;
  fecha_conferencia: string;
  ponente_conferencia: string;
  descripcion_conferencia: string;
  imagen_conferencia: string;
  link_conferencia: string;
  creador: number;
}
