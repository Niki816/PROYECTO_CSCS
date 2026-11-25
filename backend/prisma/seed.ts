import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existe = await prisma.usuario.findFirst();
  if (existe) {
    console.log('ℹ️  Ya existe un usuario admin, saltando seed.');
    return;
  }
  const password = await bcrypt.hash('admin123', 10);
  await prisma.usuario.create({
    data: {
      email: 'admin@cscs.com',
      password,
      nombre: 'Administrador CSCS',
    },
  });
  console.log('✅ Admin creado:');
  console.log('   📧 admin@cscs.com');
  console.log('   🔑 admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());