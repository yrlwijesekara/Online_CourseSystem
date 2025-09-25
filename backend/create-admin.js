import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('Creating test users for different roles...');

  const users = [
    {
      email: 'admin@courseplatform.com',
      password: 'Admin123!',
      name: 'Main Admin',
      role: 'ADMIN',
      bio: 'Main Administrator'
    },
    {
      email: 'instructor@courseplatform.com',
      password: 'Instructor123!',
      name: 'Test Instructor',
      role: 'INSTRUCTOR',
      bio: 'Course Instructor'
    },
    {
      email: 'student@courseplatform.com',
      password: 'Student123!',
      name: 'Test Student',
      role: 'STUDENT',
      bio: 'Course Student'
    }
  ];

  console.log('\n📋 User Accounts Created:');
  console.log('=========================');

  for (const user of users) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (existingUser) {
      console.log(`\n👤 ${user.role} account already exists:`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Password: ${user.password}`);
      continue;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create new user
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        bio: user.bio,
        avatarUrl: null
      }
    });

    console.log(`\n✅ New ${user.role} account created:`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Password: ${user.password}`);
    console.log(`👤 User ID: ${createdUser.id}`);
    console.log(`🎭 Role: ${createdUser.role}`);
  }
}

createTestUsers()
  .catch((e) => {
    console.error('❌ Error creating users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });