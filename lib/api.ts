import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  PaginatedResponse, 
  User, 
  LoginResponse,
  AuthStatusResponse,
  Curso, 
  Noticia, 
  Proyecto, 
  Integrante, 
  OfertaEmpleo, 
  Conferencia,
  Permissions
} from '@/types/api';

class APIClient {
  private readonly client: ReturnType<typeof axios.create>;
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://apihack3r-production.up.railway.app',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar token automáticamente
    this.client.interceptors.request.use((config) => {
      const token = Cookies.get('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
      }
      return config;
    });    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log completo del error para depuración
        console.error('🚨 API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          config: {
            method: error.config?.method?.toUpperCase(),
            url: error.config?.url,
            baseURL: error.config?.baseURL
          }
        });

        if (error.response?.status === 401) {
          // Token inválido o expirado - redirect a login
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
        }
          // Manejo específico de errores según Railway
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData) {
            // Formatear errores de validación de Django
            const errorMessages: string[] = [];
            Object.keys(errorData).forEach(key => {
              if (Array.isArray(errorData[key])) {
                errorMessages.push(...errorData[key]);
              } else {
                errorMessages.push(errorData[key]);
              }
            });
            throw new Error(`Errores de validación: ${errorMessages.join(', ')}`);
          }
        }

        // Manejo específico de errores 500
        if (error.response?.status === 500) {
          const errorData = error.response.data;
          console.error('🔥 Error 500 detectado:', errorData);
          
          // Intentar extraer información útil del error
          let errorMessage = 'Error interno del servidor (500)';
          if (errorData) {
            if (typeof errorData === 'string') {
              errorMessage = `Error del servidor: ${errorData}`;
            } else if (errorData.detail) {
              errorMessage = `Error del servidor: ${errorData.detail}`;
            } else if (errorData.error) {
              errorMessage = `Error del servidor: ${errorData.error}`;
            } else if (errorData.message) {
              errorMessage = `Error del servidor: ${errorData.message}`;
            }
          }
          throw new Error(errorMessage);
        }

        // Si el backend está caído (502, 503), agregar más información
        if (error.response?.status === 502 || error.response?.status === 503) {
          throw new Error('Backend no disponible - Servidor no responde');
        }

        // Error de red sin respuesta del servidor
        if (!error.response) {
          throw new Error('Error de red - No se pudo conectar al servidor');
        }

        throw new Error(error.response?.data?.detail ?? error.message ?? 'Error desconocido de la API');
      }
    );
  }
  // Métodos genéricos
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }
  async post<T>(endpoint: string, data: Record<string, unknown> | FormData): Promise<T> {
    console.log('📤 POST Request:', {
      endpoint,
      baseURL: this.client.defaults.baseURL,
      isFormData: data instanceof FormData,
      data: data instanceof FormData ? 'FormData object' : { ...data, password: (data as Record<string, unknown>).password ? '[HIDDEN]' : undefined }
    });
    
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const response = await this.client.post<T>(endpoint, data, config);
    
    console.log('📨 POST Response:', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      dataType: typeof response.data,
      dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : []
    });
    
    return response.data;
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }
  // CURSOS
  async getCursos(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<Curso>>('/api/hl4/v1/cursos/', params);
  }

  async getCurso(id: number) {
    return this.get<Curso>(`/api/hl4/v1/cursos/${id}/`);
  }

  async createCurso(data: Omit<Curso, 'idcursos'>) {
    return this.post<Curso>('/api/hl4/v1/cursos/', data);
  }

  async updateCurso(id: number, data: Partial<Curso>) {
    return this.put<Curso>(`/api/hl4/v1/cursos/${id}/`, data);
  }

  async deleteCurso(id: number) {
    return this.delete(`/api/hl4/v1/cursos/${id}/`);
  }
  // NOTICIAS
  async getNoticias(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<Noticia>>('/api/hl4/v1/noticias/', params);
  }

  async getNoticia(id: number) {
    return this.get<Noticia>(`/api/hl4/v1/noticias/${id}/`);
  }

  async createNoticia(data: Omit<Noticia, 'idnoticia'>) {
    return this.post<Noticia>('/api/hl4/v1/noticias/', data);
  }

  async updateNoticia(id: number, data: Partial<Noticia>) {
    return this.put<Noticia>(`/api/hl4/v1/noticias/${id}/`, data);
  }

  async deleteNoticia(id: number) {
    return this.delete(`/api/hl4/v1/noticias/${id}/`);
  }
  // PROYECTOS
  async getProyectos(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<Proyecto>>('/api/hl4/v1/proyectos/', params);
  }

  async getProyecto(id: number) {
    return this.get<Proyecto>(`/api/hl4/v1/proyectos/${id}/`);
  }

  async createProyecto(data: Omit<Proyecto, 'idproyectos'>) {
    return this.post<Proyecto>('/api/hl4/v1/proyectos/', data);
  }

  async updateProyecto(id: number, data: Partial<Proyecto>) {
    return this.put<Proyecto>(`/api/hl4/v1/proyectos/${id}/`, data);
  }

  async deleteProyecto(id: number) {
    return this.delete(`/api/hl4/v1/proyectos/${id}/`);
  }
  // INTEGRANTES
  async getIntegrantes(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<Integrante>>('/api/hl4/v1/integrantes/', params);
  }

  async getIntegrante(id: number) {
    return this.get<Integrante>(`/api/hl4/v1/integrantes/${id}/`);
  }

  async createIntegrante(data: Omit<Integrante, 'idintegrantes'>) {
    return this.post<Integrante>('/api/hl4/v1/integrantes/', data);
  }

  async updateIntegrante(id: number, data: Partial<Integrante>) {
    return this.put<Integrante>(`/api/hl4/v1/integrantes/${id}/`, data);
  }

  async deleteIntegrante(id: number) {
    return this.delete(`/api/hl4/v1/integrantes/${id}/`);
  }
  // OFERTAS DE EMPLEO
  async getOfertas(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<OfertaEmpleo>>('/api/hl4/v1/ofertasempleo/', params);
  }

  async getOferta(id: number) {
    return this.get<OfertaEmpleo>(`/api/hl4/v1/ofertasempleo/${id}/`);
  }

  async createOferta(data: Omit<OfertaEmpleo, 'idoferta'>) {
    return this.post<OfertaEmpleo>('/api/hl4/v1/ofertasempleo/', data);
  }

  async updateOferta(id: number, data: Partial<OfertaEmpleo>) {
    return this.put<OfertaEmpleo>(`/api/hl4/v1/ofertasempleo/${id}/`, data);
  }

  async deleteOferta(id: number) {
    return this.delete(`/api/hl4/v1/ofertasempleo/${id}/`);
  }
  // CONFERENCIAS
  async getConferencias(params?: { search?: string; page?: number }) {
    return this.get<PaginatedResponse<Conferencia>>('/api/hl4/v1/conferencias/', params);
  }

  async getConferencia(id: number) {
    return this.get<Conferencia>(`/api/hl4/v1/conferencias/${id}/`);
  }

  async createConferencia(data: Omit<Conferencia, 'idconferencia'>) {
    return this.post<Conferencia>('/api/hl4/v1/conferencias/', data);
  }

  async updateConferencia(id: number, data: Partial<Conferencia>) {
    return this.put<Conferencia>(`/api/hl4/v1/conferencias/${id}/`, data);
  }

  async deleteConferencia(id: number) {
    return this.delete(`/api/hl4/v1/conferencias/${id}/`);
  }

  // MÉTODOS ESPECÍFICOS PARA CREAR CON ARCHIVOS
  async createOfertaWithFile(data: Omit<OfertaEmpleo, 'idoferta'>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    
    return this.post<OfertaEmpleo>('/api/hl4/v1/ofertasempleo/', formData);
  }

  async createIntegranteWithFile(data: Omit<Integrante, 'idintegrantes'>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    
    return this.post<Integrante>('/api/hl4/v1/integrantes/', formData);
  }

  async createConferenciaWithFile(data: Omit<Conferencia, 'idconferencia'>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen_conferencia', imageFile);
    }
    
    return this.post<Conferencia>('/api/hl4/v1/conferencias/', formData);
  }

  async createNoticiaWithFile(data: Omit<Noticia, 'idnoticia'>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen_noticia', imageFile);
    }
    
    return this.post<Noticia>('/api/hl4/v1/noticias/', formData);
  }

  // MÉTODOS ESPECÍFICOS PARA ACTUALIZAR CON ARCHIVOS
  async updateConferenciaWithFile(id: number, data: Partial<Conferencia>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen_conferencia', imageFile);
    }
    
    // Usar PUT pero a través del método que acepta FormData
    return this.putWithFile<Conferencia>(`/api/hl4/v1/conferencias/${id}/`, formData);
  }

  async updateNoticiaWithFile(id: number, data: Partial<Noticia>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen_noticia', imageFile);
    }
    
    return this.putWithFile<Noticia>(`/api/hl4/v1/noticias/${id}/`, formData);
  }

  async updateIntegranteWithFile(id: number, data: Partial<Integrante>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    
    return this.putWithFile<Integrante>(`/api/hl4/v1/integrantes/${id}/`, formData);
  }

  async updateOfertaWithFile(id: number, data: Partial<OfertaEmpleo>, imageFile?: File) {
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    Object.keys(data).forEach(key => {
      const value = (data as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Agregar archivo de imagen si existe
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    
    return this.putWithFile<OfertaEmpleo>(`/api/hl4/v1/ofertasempleo/${id}/`, formData);
  }

  // Método auxiliar para PUT con FormData
  private async putWithFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await this.client.put<T>(endpoint, formData, config);
    return response.data;
  }

  // AUTENTICACIÓN - Implementación según Railway Solution
  async login(username: string, password: string) {
    console.log('🔐 Enviando login request a Railway:', {
      endpoint: '/auth/login/',
      username,
      passwordLength: password.length,
      baseURL: this.client.defaults.baseURL
    });

    try {
      // Primer paso: hacer login y obtener token
      const loginResponse = await this.post<{ key: string }>('/auth/login/', {
        username,
        password,
      });

      console.log('✅ Login exitoso en Railway - Token recibido:', {
        hasKey: Boolean(loginResponse?.key),
        keyLength: loginResponse?.key?.length || 0
      });      // Validar que se recibió el token
      if (!loginResponse?.key) {
        throw new Error('Token de autenticación no recibido');
      }      // Segundo paso: obtener datos del usuario usando el token
      console.log('👤 Obteniendo datos del usuario con el token...');
      
      try {
        // Hacer petición al endpoint correcto que incluye permisos
        const userResponse = await this.client.get<User>('/api/profile/', {
          headers: {
            'Authorization': `Token ${loginResponse.key}`
          }
        });
        
        const userProfile = userResponse.data;
        
        console.log('✅ Perfil de usuario obtenido:', {
          username: userProfile.username,
          is_staff: userProfile.is_staff,
          is_superuser: userProfile.is_superuser,
          id: userProfile.id
        });        // Asegurar compatibilidad con el código existente
        const normalizedUser: User = {
          id: userProfile.id ?? userProfile.pk,
          pk: userProfile.pk ?? userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          is_staff: userProfile.is_staff ?? false,
          is_superuser: userProfile.is_superuser ?? false,
        };

        // Retornar en el formato esperado por el código existente
        return {
          key: loginResponse.key,
          user: normalizedUser
        };
        
      } catch (profileError) {
        console.error('❌ Error obteniendo perfil de usuario:', profileError);
        throw new Error('No se pudieron obtener los datos del usuario');
      }

    } catch (error: unknown) {
      console.error('❌ Error de login en Railway:', {
        error,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async logout() {
    console.log('👋 Enviando logout request a Railway...');
    try {
      return await this.post('/auth/logout/', {});
    } catch (error) {
      console.error('❌ Error de logout en Railway:', error);
      throw error;
    }
  }
  async getProfile() {
    console.log('👤 Obteniendo perfil desde Railway...');
    try {
      const profile = await this.get<User>('/api/profile/');
      console.log('✅ Perfil obtenido:', {
        username: profile.username,
        is_staff: profile.is_staff,
        is_superuser: profile.is_superuser
      });
      return profile;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  }

  // Método para registro (según especificaciones de Railway)
  async register(email: string, password: string): Promise<LoginResponse>;
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<LoginResponse>;
  async register(emailOrUserData: string | {
    username: string;
    email: string;
    password: string;
  }, password?: string): Promise<LoginResponse> {
    let userData: {
      username: string;
      email: string;
      password: string;
    };

    if (typeof emailOrUserData === 'string' && password) {
      userData = {
        username: emailOrUserData.split('@')[0], // Use email prefix as username
        email: emailOrUserData,
        password: password
      };
    } else if (typeof emailOrUserData === 'object') {
      userData = emailOrUserData;
    } else {
      throw new Error('Invalid parameters for register method');
    }

    console.log('📝 Enviando registro request a Railway:', {
      endpoint: '/auth/registration/',
      username: userData.username,
      email: userData.email
    });

    try {
      const response = await this.post<LoginResponse>('/auth/registration/', {
        username: userData.username,
        email: userData.email,
        password1: userData.password,
        password2: userData.password, // Confirmar contraseña requerida por Railway
      });

      console.log('✅ Registro exitoso en Railway');
      return response;
    } catch (error) {
      console.error('❌ Error de registro en Railway:', error);
      throw error;
    }
  }

  async getCustomProfile() {
    return this.get<User>('/api/hl4/v1/profile/');
  }

  async checkAuthStatus() {
    return this.post<AuthStatusResponse>('/api/hl4/v1/auth-status/', {});
  }

  async getUserPermissions(): Promise<Permissions> {
    const response = await this.client.get<Permissions>('/auth/permissions/');
    return response.data;
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return (response.data as { url: string }).url;
  }

  // Métodos faltantes para compatibilidad
  async getCurrentUser(): Promise<User> {
    return this.getProfile();
  }

  setToken(token: string): void {
    Cookies.set('auth_token', token, { expires: 7 });
  }

  clearToken(): void {
    Cookies.remove('auth_token');
  }
}

export const apiClient = new APIClient();