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

  const courses = await prisma.course.createMany({
    data: [
      {
        name: 'Complete Python Programming',
        description:
          'Learn Python from basics to advanced topics with real-world projects.',
        duration: '8 hours',
        price: '49',
        currency: 'USD',
        isPublished: true,
      },
      {
        name: 'Mastering Excel for Beginners',
        description:
          'Start using Excel confidently with formulas, functions, charts, and data management.',
        duration: '5 hours',
        price: '34',
        currency: 'USD',
        isPublished: true,
      },
      {
        name: 'Web Development Bootcamp',
        description:
          'Full-stack web development with HTML, CSS, JavaScript, and backend frameworks.',
        duration: '20 hours',
        price: '99',
        currency: 'USD',
        isPublished: true,
      },
      {
        name: 'Introduction to Machine Learning',
        description:
          'Understand core ML concepts, algorithms, and how to build simple models.',
        duration: '10 hours',
        price: '59',
        currency: 'USD',
        isPublished: false,
      },
      {
        name: 'UI/UX Design Fundamentals',
        description:
          'Learn the essentials of user interface and user experience design.',
        duration: '6 hours',
        price: '39',
        currency: 'USD',
        isPublished: true,
      },
    ],
  });

  console.log('upsert', upsert, upsert2, courses);
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
