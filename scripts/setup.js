const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

async function setup() {
  console.log('🚀 Configuración inicial de Fibertech\n');

  // Verificar si .env ya existe
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  El archivo .env ya existe. ¿Deseas sobrescribirlo? (s/n): ');
    if (overwrite.toLowerCase() !== 's') {
      console.log('❌ Setup cancelado.');
      rl.close();
      return;
    }
  }

  // Solicitar información de la base de datos
  console.log('\n📊 Configuración de PostgreSQL:');
  const dbUser = await question('Usuario de PostgreSQL (default: postgres): ') || 'postgres';
  const dbPassword = await question('Contraseña de PostgreSQL: ') || 'Princonserkids2025+';
  const dbHost = await question('Host (default: localhost): ') || 'localhost';
  const dbPort = await question('Puerto (default: 5432): ') || '5432';
  const dbName = await question('Nombre de la base de datos (default: fibertech): ') || 'fibertech';

  // Solicitar URL de NextAuth
  console.log('\n🔐 Configuración de NextAuth:');
  const nextAuthUrl = await question('NEXTAUTH_URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  // Generar secret automáticamente
  const nextAuthSecret = generateSecret();
  console.log(`✅ NEXTAUTH_SECRET generado automáticamente`);

  // Crear contenido del .env
  const envContent = `# Base de datos PostgreSQL
DATABASE_URL="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public"

# NextAuth - URL de la aplicación
NEXTAUTH_URL="${nextAuthUrl}"

# NextAuth - Secret key (generado automáticamente)
NEXTAUTH_SECRET="${nextAuthSecret}"
`;

  // Escribir archivo .env
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Archivo .env creado exitosamente');

  // Configurar base de datos
  console.log('\n📦 Configurando base de datos...');
  try {
    console.log('  → Generando cliente Prisma...');
    execSync('npm run db:generate', { stdio: 'inherit' });
    
    console.log('  → Creando tablas en la base de datos...');
    execSync('npm run db:push', { stdio: 'inherit' });
    
    console.log('✅ Base de datos configurada exitosamente');
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error.message);
    console.log('\n⚠️  Por favor, verifica que PostgreSQL esté corriendo y que las credenciales sean correctas.');
    rl.close();
    return;
  }

  // Crear usuario administrador
  console.log('\n👤 Creación de usuario administrador:');
  const createAdmin = await question('¿Deseas crear un usuario administrador ahora? (s/n): ');
  
  if (createAdmin.toLowerCase() === 's') {
    const adminName = await question('Nombre del administrador: ');
    const adminEmail = await question('Email del administrador: ');
    const adminPassword = await question('Contraseña del administrador: ');
    
    try {
      execSync(`node scripts/create-admin.js "${adminName}" "${adminEmail}" "${adminPassword}"`, { stdio: 'inherit' });
      console.log('✅ Usuario administrador creado exitosamente');
    } catch (error) {
      console.error('❌ Error al crear el usuario administrador:', error.message);
    }
  }

  console.log('\n🎉 ¡Setup completado exitosamente!');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. Verifica que el archivo .env tenga la configuración correcta');
  console.log('   2. Ejecuta "npm run dev" para iniciar el servidor de desarrollo');
  if (createAdmin.toLowerCase() !== 's') {
    console.log('   3. Crea un usuario administrador ejecutando: npm run create-admin');
  }
  
  rl.close();
}

setup().catch(console.error);