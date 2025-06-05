// Prueba completa del flujo de login corregido
const axios = require('axios');

async function testLoginFlow() {
  console.log('🧪 Probando flujo completo de login corregido...');
  
  const baseURL = 'https://apihack3r-production.up.railway.app';
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  try {
    console.log('🔐 Paso 1: Login para obtener token...');
    
    const loginResponse = await client.post('/auth/login/', {
      username: 'admin',
      password: 'Hack3r2024!@#'
    });

    console.log('✅ Token obtenido:', {
      hasKey: Boolean(loginResponse.data?.key),
      keyLength: loginResponse.data?.key?.length || 0,
      keyPreview: loginResponse.data?.key?.substring(0, 8) + '...'
    });

    if (!loginResponse.data?.key) {
      throw new Error('No se obtuvo el token');
    }

    console.log('👤 Paso 2: Obteniendo perfil con el token...');
    
    const profileResponse = await client.get('/auth/user/', {
      headers: {
        'Authorization': `Token ${loginResponse.data.key}`
      }
    });

    console.log('✅ Perfil obtenido:', {
      username: profileResponse.data.username,
      email: profileResponse.data.email,
      is_staff: profileResponse.data.is_staff,
      is_superuser: profileResponse.data.is_superuser,
      fullProfile: profileResponse.data
    });

    console.log('🎯 RESULTADO FINAL - Estructura que devolvería el cliente:');
    const finalResult = {
      key: loginResponse.data.key,
      user: profileResponse.data
    };
    
    console.log(JSON.stringify(finalResult, null, 2));
    
    console.log('✅ ¡Flujo de login completado exitosamente!');
    return finalResult;
    
  } catch (error) {
    console.error('❌ Error en el flujo de login:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
}

testLoginFlow().catch(console.error);
