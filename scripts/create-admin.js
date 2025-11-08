const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Uso: node scripts/create-admin.js <nombre> <email> <contraseña>');
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

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nombre: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Rol: ${admin.role}`);
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();