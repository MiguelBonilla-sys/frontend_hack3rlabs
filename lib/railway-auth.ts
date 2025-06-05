// Funciones de autenticación específicas para Railway
// Basado en RAILWAY_FRONTEND_SOLUTION.md

const API_BASE_URL = 'https://apihack3r-production.up.railway.app';

// Headers comunes según especificaciones de Railway
const getHeaders = (token: string | null = null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return headers;
};

// Función de registro según Railway
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    console.log('📝 Registrando usuario en Railway...', {
      username: userData.username,
      email: userData.email
    });

    const response = await fetch(`${API_BASE_URL}/auth/registration/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password1: userData.password,
        password2: userData.password, // Confirmar contraseña
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en registro Railway:', errorData);
      throw new Error(`Registro falló: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log('✅ Usuario registrado exitosamente en Railway:', data);
    return {
      success: true,
      token: data.key,
      user: data.user
    };
    
  } catch (error) {
    console.error('💥 Error en registerUser Railway:', error);
    throw error;
  }
};

// Función de login según Railway
export const loginUser = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    console.log('🔐 Login en Railway...', {
      username: credentials.username,
      passwordLength: credentials.password.length
    });

    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en login Railway:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`Login falló: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log('✅ Login exitoso en Railway:', {
      hasKey: Boolean(data.key),
      keyLength: data.key?.length ?? 0
    });
    return {
      success: true,
      token: data.key
    };
    
  } catch (error) {
    console.error('💥 Error en loginUser Railway:', error);
    throw error;
  }
};

// Función para obtener perfil según Railway
export const getUserProfile = async (token: string) => {
  try {
    console.log('👤 Obteniendo perfil desde Railway...');

    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error obteniendo perfil Railway:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`Error: ${JSON.stringify(errorData)}`);
    }
    
    const userData = await response.json();
    console.log('✅ Perfil obtenido desde Railway:', {
      username: userData.username,
      is_staff: userData.is_staff,
      is_superuser: userData.is_superuser
    });
    return userData;
    
  } catch (error) {
    console.error('💥 Error en getUserProfile Railway:', error);
    throw error;
  }
};

// Función de logout según Railway
export const logoutUser = async (token: string) => {
  try {
    console.log('👋 Logout en Railway...');

    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en logout Railway:', errorData);
      throw new Error(`Logout falló: ${JSON.stringify(errorData)}`);
    }
    
    console.log('✅ Logout exitoso en Railway');
    return { success: true };
    
  } catch (error) {
    console.error('💥 Error en logoutUser Railway:', error);
    throw error;
  }
};

// Función de debugging para verificar conectividad con Railway
export const debugRailwayAuth = async () => {
  console.log('🔍 Verificando conectividad con Railway...');
  
  // 1. Verificar conectividad
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`);
    console.log('✅ Railway accesible, status:', response.status);
    
    if (response.status === 405) {
      console.log('✅ Endpoint /auth/login/ existe (405 = Method Not Allowed para GET)');
    }
  } catch (error) {
    console.error('❌ Railway no accesible:', error);
    return false;
  }
  
  return true;
};

// Función para verificar requisitos de contraseña según Railway
export const validatePasswordForRailway = (password: string, username: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Requisitos según Railway documentation
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('La contraseña no puede ser demasiado similar al nombre de usuario');
  }
  
  // Contraseñas comunes a evitar
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('La contraseña es demasiado común');
  }
    // Debe contener letras y números
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasLetters || !hasNumbers) {
    errors.push('La contraseña debe contener letras y números');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Ejemplo de flujo completo según Railway
export const railwayAuthExample = async () => {
  try {
    console.log('🚀 Iniciando flujo de autenticación Railway...');
    
    // Verificar conectividad primero
    const isConnected = await debugRailwayAuth();
    if (!isConnected) {
      throw new Error('No se pudo conectar con Railway');
    }
    
    // 1. Registrar usuario (opcional)
    console.log('📝 Ejemplo de registro...');
    const registerResult = await registerUser({
      username: 'railwayuser',
      email: 'railway@test.com',
      password: 'RailwayPassword123!'
    });
    
    const token = registerResult.token;
    console.log('✅ Usuario registrado, token:', token?.substring(0, 10) + '...');
    
    // 2. Obtener perfil
    console.log('👤 Obteniendo perfil...');
    const profile = await getUserProfile(token);
    console.log('✅ Perfil:', profile);
    
    // 3. Logout
    console.log('👋 Cerrando sesión...');
    await logoutUser(token);
    console.log('✅ Logout completado');
    
    // 4. Login con las mismas credenciales
    console.log('🔐 Haciendo login...');
    const loginResult = await loginUser({
      username: 'railwayuser',
      password: 'RailwayPassword123!'
    });
    console.log('✅ Login exitoso:', loginResult);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en flujo de autenticación Railway:', error);
    return false;
  }
};
