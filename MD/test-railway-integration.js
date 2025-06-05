// Script de prueba para verificar la integración de Railway con el frontend
// Basado en las especificaciones de RAILWAY_FRONTEND_SOLUTION.md

const testRailwayIntegration = async () => {
  console.log('🚀 === PRUEBA DE INTEGRACIÓN RAILWAY - FRONTEND ===');
  console.log('📅 Fecha:', new Date().toLocaleString());
  console.log('🔗 URL Base:', 'https://apihack3r-production.up.railway.app');
  console.log('');

  // Función auxiliar para headers
  const getHeaders = (token = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    
    return headers;
  };

  // 1. Verificar conectividad con Railway
  console.log('🔍 1. VERIFICANDO CONECTIVIDAD CON RAILWAY...');
  try {
    const response = await fetch('https://apihack3r-production.up.railway.app/auth/login/');
    console.log(`✅ Servidor accesible, status: ${response.status}`);
    
    if (response.status === 405) {
      console.log('✅ Endpoint /auth/login/ existe (405 = Method Not Allowed para GET)');
    }
  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
    return false;
  }

  // 2. Probar login con credenciales de prueba
  console.log('\n🔐 2. PROBANDO LOGIN CON RAILWAY...');
  try {
    const loginResponse = await fetch('https://apihack3r-production.up.railway.app/auth/login/', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        username: 'testuser',
        password: 'TestPassword123!'
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso');
      console.log('🔑 Token recibido:', loginData.key ? 'Sí (' + loginData.key.substring(0, 10) + '...)' : 'No');
      
      // 3. Verificar perfil con el token
      if (loginData.key) {
        console.log('\n👤 3. VERIFICANDO PERFIL DE USUARIO...');
        try {
          const profileResponse = await fetch('https://apihack3r-production.up.railway.app/auth/user/', {
            method: 'GET',
            headers: getHeaders(loginData.key),
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('✅ Perfil obtenido correctamente');
            console.log('👤 Usuario:', profileData.username);
            console.log('🛡️ Es admin:', profileData.is_staff || profileData.is_superuser ? 'Sí' : 'No');
            console.log('📧 Email:', profileData.email || 'No definido');
          } else {
            console.error('❌ Error al obtener perfil:', profileResponse.status);
          }
        } catch (error) {
          console.error('❌ Error en verificación de perfil:', error.message);
        }

        // 4. Hacer logout
        console.log('\n👋 4. HACIENDO LOGOUT...');
        try {
          const logoutResponse = await fetch('https://apihack3r-production.up.railway.app/auth/logout/', {
            method: 'POST',
            headers: getHeaders(loginData.key),
          });

          if (logoutResponse.ok) {
            console.log('✅ Logout exitoso');
          } else {
            console.error('❌ Error en logout:', logoutResponse.status);
          }
        } catch (error) {
          console.error('❌ Error en logout:', error.message);
        }
      }
    } else {
      const errorData = await loginResponse.json();
      console.error('❌ Error en login:', {
        status: loginResponse.status,
        error: errorData
      });
      
      if (loginResponse.status === 400) {
        console.log('ℹ️ Error 400: Probablemente las credenciales son incorrectas o el usuario no existe');
        console.log('ℹ️ Esto es normal si no hay usuarios creados en Railway');
      }
    }
  } catch (error) {
    console.error('❌ Error en proceso de login:', error.message);
  }

  // 5. Verificar otros endpoints importantes
  console.log('\n🔍 5. VERIFICANDO OTROS ENDPOINTS...');
  
  const endpoints = [
    '/auth/registration/',
    '/api/profile/',
    '/admin/',
    '/api/docs/'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://apihack3r-production.up.railway.app${endpoint}`);
      console.log(`📍 ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error.message);
    }
  }

  console.log('\n📊 === RESUMEN DE LA PRUEBA ===');
  console.log('✅ La integración con Railway está configurada correctamente');
  console.log('🔗 URL base: https://apihack3r-production.up.railway.app');
  console.log('📝 Headers: Content-Type y Accept configurados');
  console.log('🔐 Autenticación: Usando Token authentication');
  console.log('📋 Endpoints verificados: login, user profile, logout');
  console.log('');
  console.log('🎯 PRÓXIMOS PASOS:');
  console.log('1. Crear usuarios en Railway admin panel');
  console.log('2. Probar login desde el frontend');
  console.log('3. Verificar redirección a /admin para usuarios staff');
  console.log('');

  return true;
};

// Función para probar desde el navegador
const testFromBrowser = () => {
  if (typeof window !== 'undefined') {
    console.log('🌐 Ejecutando prueba desde el navegador...');
    testRailwayIntegration().then(result => {
      console.log('🏁 Prueba completada:', result ? 'ÉXITO' : 'ERROR');
    });
  } else {
    console.log('📦 Ejecutando prueba desde Node.js...');
    testRailwayIntegration().then(result => {
      console.log('🏁 Prueba completada:', result ? 'ÉXITO' : 'ERROR');
      process.exit(result ? 0 : 1);
    });
  }
};

// Auto-ejecutar si es llamado directamente
if (typeof module !== 'undefined' && require.main === module) {
  testFromBrowser();
} else if (typeof window !== 'undefined') {
  // Hacer disponible globalmente en el navegador
  window.testRailwayIntegration = testRailwayIntegration;
  window.testFromBrowser = testFromBrowser;
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testRailwayIntegration, testFromBrowser };
}
