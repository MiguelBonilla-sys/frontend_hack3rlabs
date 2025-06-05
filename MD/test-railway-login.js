// Test específico para probar la estructura de respuesta del login de Railway
const axios = require('axios');

async function testRailwayLogin() {
  console.log('🧪 Probando estructura de respuesta de Railway login...');
  
  const baseURL = 'https://apihack3r-production.up.railway.app';
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Interceptor para ver todo el tráfico
  client.interceptors.request.use((config) => {
    console.log('📤 Request completo:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      console.log('✅ Response exitoso:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        dataType: typeof response.data,
        dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : []
      });
      return response;
    },
    (error) => {
      console.log('❌ Response con error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        dataType: typeof error.response?.data,
        dataKeys: error.response?.data && typeof error.response?.data === 'object' ? Object.keys(error.response.data) : [],
        message: error.message
      });
      return Promise.reject(error);
    }
  );

  // Probar diferentes credenciales y endpoints
  const testCases = [
    {
      name: 'Admin con endpoint /auth/login/',
      endpoint: '/auth/login/',
      credentials: { username: 'admin', password: 'Hack3r2024!@# ' }
    },
    {
      name: 'Test con endpoint /auth/login/',
      endpoint: '/auth/login/',
      credentials: { username: 'test123', password: 'test123!' }
    },
    {
      name: 'Admin con endpoint /api/auth/login/',
      endpoint: '/api/auth/login/',
      credentials: { username: 'admin', password: 'admin123' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Probando: ${testCase.name}`);
    console.log(`📍 Endpoint: ${testCase.endpoint}`);
    
    try {
      const response = await client.post(testCase.endpoint, testCase.credentials);
      console.log(`✅ Éxito con ${testCase.name}:`, {
        status: response.status,
        data: response.data
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`⚠️ Credenciales incorrectas para ${testCase.name}, pero endpoint funciona`);
        console.log('Estructura de error:', error.response.data);
      } else if (error.response?.status === 405) {
        console.log(`❌ Método no permitido para ${testCase.name} - endpoint posiblemente incorrecto`);
      } else if (error.response?.status === 404) {
        console.log(`❌ Endpoint no encontrado: ${testCase.endpoint}`);
      } else {
        console.log(`❌ Error inesperado para ${testCase.name}:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    }
  }
}

testRailwayLogin().catch(console.error);
