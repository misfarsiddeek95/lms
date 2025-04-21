import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const upsert = await prisma.user.upsert({
    where: {
      email: 'admin@admin.com',
    },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@admin.com',
      password: '$2b$10$gG2zebcqRzWxtJL8UAYqAeCLIr1U2e3DOw2.LBpefOy4gt4ZhIA1O', // pass@123
      role: 'ADMIN',
    },
    update: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@admin.com',
      role: 'ADMIN',
    },
  });

  const upsert2 = await prisma.user.upsert({
    where: {
      email: 'student@smail.com',
    },
    create: {
      firstName: 'David',
      lastName: 'Bombal',
      email: 'student@smail.com',
      password: '$2b$10$gG2zebcqRzWxtJL8UAYqAeCLIr1U2e3DOw2.LBpefOy4gt4ZhIA1O', // pass@123
      role: 'STUDENT',
    },
    update: {
      firstName: 'David',
      lastName: 'Bombal',
      email: 'student@smail.com',
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
