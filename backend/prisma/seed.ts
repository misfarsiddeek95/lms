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

  const users = await prisma.user.createMany({
    data: [
      {
        firstName: 'Emily',
        lastName: 'Clark',
        email: 'emily.c@smail.com',
        password:
          '$2b$10$GPR6k.aOvF4b7K7CSxCHvu5w7JuYBCRMTOf1e02qUQeSp49Hh4q9m', // student@456
        role: 'STUDENT',
      },
      {
        firstName: 'Liam',
        lastName: 'Brown',
        email: 'liam.b@smail.com',
        password:
          '$2b$10$nw9vPyTdvU5v3QDKDwXcduDzq4UOoClDL8Be1Ly0Zs0gYqYtP0LIq', // student@789
        role: 'STUDENT',
      },
      {
        firstName: 'Sophia',
        lastName: 'Williams',
        email: 'sophia.w@smail.com',
        password:
          '$2b$10$y3/WiFsvZxIUbHbfDKI/OOBVxPSvD9Yh5rZBCM0lXxO1vxoPKklrq', // pass@stu1
        role: 'STUDENT',
      },
      {
        firstName: 'Noah',
        lastName: 'Taylor',
        email: 'noah.t@smail.com',
        password:
          '$2b$10$e4QjvwXR9U3yMI7cQ3mlguu4xu9EMJgLbFfuIK.mMo5k5AzVo6Mbe', // pass@stu2
        role: 'STUDENT',
      },
    ],
  });

  const enroll = await prisma.enrollment.createMany({
    data: [
      {
        userId: 2,
        courseId: 1,
      },
      {
        userId: 2,
        courseId: 2,
      },
      {
        userId: 2,
        courseId: 3,
      },
      {
        userId: 3,
        courseId: 3,
      },
      {
        userId: 3,
        courseId: 4,
      },
    ],
  });

  console.log('upsert', upsert, upsert2, courses, users, enroll);
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
