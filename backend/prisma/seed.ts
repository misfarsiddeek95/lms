import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const upsert = await prisma.user.upsert({
    where: {
      email: 'asmmisfar@gmail.com',
    },
    create: {
      firstName: 'Misfar',
      lastName: 'Siddeek',
      email: 'asmmisfar@gmail.com',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      role: 'ADMIN',
    },
    update: {
      firstName: 'Misfar',
      lastName: 'Siddeek',
      email: 'asmmisfar@gmail.com',
      role: 'ADMIN',
    },
  });

  const upsert2 = await prisma.user.upsert({
    where: {
      email: 'student@gmail.com',
    },
    create: {
      firstName: 'David',
      lastName: 'Bombal',
      email: 'student@gmail.com',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      role: 'STUDENT',
    },
    update: {
      firstName: 'David',
      lastName: 'Bombal',
      email: 'student@gmail.com',
      role: 'STUDENT',
    },
  });

  console.log('upsert', upsert, upsert2);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
