// Test final del login corregido con el endpoint correcto
const axios = require('axios');

async function testFinalLoginFlow() {
  console.log('🧪 Probando flujo FINAL de login con endpoint /api/profile/...');
  
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
      keyLength: loginResponse.data?.key?.length || 0
    });

    if (!loginResponse.data?.key) {
      throw new Error('No se obtuvo el token');
    }

    console.log('👤 Paso 2: Obteniendo perfil completo con permisos...');
    
    const profileResponse = await client.get('/api/profile/', {
      headers: {
        'Authorization': `Token ${loginResponse.data.key}`
      }
    });

    console.log('✅ Perfil completo obtenido:', profileResponse.data);

    // Simular la normalización que hace el cliente
    const normalizedUser = {
      id: profileResponse.data.id ?? profileResponse.data.pk,
      pk: profileResponse.data.pk ?? profileResponse.data.id,
      username: profileResponse.data.username,
      email: profileResponse.data.email,
      first_name: profileResponse.data.first_name,
      last_name: profileResponse.data.last_name,
      is_staff: profileResponse.data.is_staff ?? false,
      is_superuser: profileResponse.data.is_superuser ?? false,
    };

    console.log('🎯 Usuario normalizado:', normalizedUser);

    console.log('🚀 Resultado FINAL - Estructura completa:');
    const finalResult = {
      key: loginResponse.data.key,
      user: normalizedUser
    };
    
    console.log(JSON.stringify(finalResult, null, 2));
    
    // Verificar permisos de admin
    const isAdmin = normalizedUser.is_staff || normalizedUser.is_superuser;
    console.log(`\n👑 ¿Es administrador? ${isAdmin ? '✅ SÍ' : '❌ NO'}`);
    console.log(`📋 Permisos:`, {
      is_staff: normalizedUser.is_staff,
      is_superuser: normalizedUser.is_superuser
    });
    
    if (isAdmin) {
      console.log('🚀 Debería redirigir a /admin');
    } else {
      console.log('🏠 Debería redirigir a /');
    }
    
    console.log('\n✅ ¡Flujo de login COMPLETADO exitosamente!');
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

testFinalLoginFlow().catch(console.error);
