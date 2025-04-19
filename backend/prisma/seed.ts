import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const upsert = await prisma.user.upsert({
    where: {
      userName: 'misfar',
    },
    create: {
      firstName: 'Misfar',
      empId: 'EMP00001',
      lastName: 'Siddeek',
      userName: 'misfar',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      department: 'MGT',
      role: 'ADMIN',
    },
    update: {
      firstName: 'Misfar',
      lastName: 'Siddeek',
      userName: 'misfar',
      department: 'MGT',
      role: 'ADMIN',
    },
  });

  const upsert2 = await prisma.user.upsert({
    where: {
      userName: 'david',
    },
    create: {
      empId: 'EMP00002',
      firstName: 'David',
      lastName: 'Bombal',
      userName: 'david',
      password: '$2b$10$6RSCLIaJ9bzeIDPMZMMSeeNPJShdUkA2RGrqoQi8gG2BrkSeZNNfG',
      department: 'DEV',
      role: 'EMPLOYEE',
    },
    update: {
      firstName: 'David',
      lastName: 'Bombal',
      userName: 'Bombal',
      department: 'DEV',
      role: 'EMPLOYEE',
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
