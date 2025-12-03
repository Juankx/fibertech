const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTecnico() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Uso: node scripts/create-tecnico.js <nombre> <email> <contraseña>');
    process.exit(1);
  }

  const [name, email, password] = args;

  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.error(`❌ El usuario con email ${email} ya existe`);
      process.exit(1);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario técnico
    const tecnico = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'TECNICO'
      }
    });

    console.log('✅ Usuario técnico creado exitosamente:');
    console.log(`   ID: ${tecnico.id}`);
    console.log(`   Nombre: ${tecnico.name}`);
    console.log(`   Email: ${tecnico.email}`);
    console.log(`   Rol: ${tecnico.role}`);
    console.log('\n📝 Nota: Recuerda asignar este técnico a una cuadrilla desde el dashboard de administración.');
  } catch (error) {
    console.error('❌ Error al crear el usuario técnico:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTecnico();

