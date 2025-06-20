// Verificar endpoints disponibles en Railway para permisos de usuario
const axios = require('axios');

async function checkRailwayUserEndpoints() {
  console.log('🔍 Verificando endpoints de usuario en Railway...');
  
  const baseURL = 'https://apihack3r-production.up.railway.app';
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Primero obtener token
  try {
    const loginResponse = await client.post('/auth/login/', {
      username: 'admin',
      password: 'Hack3r2024!@#'
    });

    const token = loginResponse.data.key;
    console.log('✅ Token obtenido para pruebas');

    // Endpoints a probar
    const endpoints = [
      '/auth/user/',
      '/api/hl4/v1/profile/',
      '/api/profile/',
      '/admin/auth/user/',
      '/api/user/permissions/',
      '/api/auth/user/',
      '/auth/user/permissions/'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Probando: ${endpoint}`);
        const response = await client.get(endpoint, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        console.log(`✅ ${endpoint}:`, {
          status: response.status,
          dataKeys: Object.keys(response.data),
          data: response.data
        });

      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ ${endpoint}: No encontrado (404)`);
        } else if (error.response?.status === 403) {
          console.log(`🔒 ${endpoint}: Sin permisos (403)`);
        } else {
          console.log(`❌ ${endpoint}: Error ${error.response?.status}`, error.response?.data);
        }
      }
    }

    // Probar acceso al admin panel
    console.log('\n🔍 Verificando acceso al admin panel...');
    try {
      const adminResponse = await client.get('/admin/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      console.log('✅ Admin panel accesible');
    } catch (error) {
      console.log('❌ Admin panel:', error.response?.status);
    }

  } catch (error) {
    console.error('❌ Error obteniendo token:', error.message);
  }
}

checkRailwayUserEndpoints().catch(console.error);
