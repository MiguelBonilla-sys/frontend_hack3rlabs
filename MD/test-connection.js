// Script de prueba para verificar la conexión con el backend Django
const API_BASE_URL = 'https://apihack3r-production.up.railway.app';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión con el backend...');
      // Probar un endpoint público primero
    const response = await fetch(`${API_BASE_URL}/api/hl4/v1/cursos/`);
    console.log('📚 Endpoint /cursos/ - Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa con el backend');
      console.log('📊 Datos recibidos:', data);
    } else {
      console.log('❌ Error en la respuesta:', response.statusText);
    }
      // Probar endpoint de login
    console.log('\n🔐 Probando endpoint de login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      body: JSON.stringify({
        username: 'admin',
        password: 'Hack3r2024!@#'
      })
    });
    
    console.log('🔑 Login endpoint - Status:', loginResponse.status);
    console.log('🔑 Login endpoint - Response:', await loginResponse.text());
    
  } catch (error) {
    console.error('💥 Error de conexión:', error);
  }
}

testConnection();
