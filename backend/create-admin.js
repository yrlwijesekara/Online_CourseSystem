import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createNewAdmin() {
  console.log('Creating a new admin user...');

  // New admin credentials
  const newAdminEmail = 'admin2@courseplatform.com';
  const newAdminPassword = 'NewAdmin123!';
  
  // Check if this admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: newAdminEmail }
  });

  if (existingAdmin) {
    console.log('This admin user already exists:', newAdminEmail);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newAdminPassword, 10);

  // Create new admin user
  const admin = await prisma.user.create({
    data: {
      email: newAdminEmail,
      password: hashedPassword,
      name: 'New Admin User',
      role: 'ADMIN',
      bio: 'Secondary Administrator',
      avatarUrl: null
    }
  });

  console.log('✅ New Admin user created successfully!');
  console.log('📧 Email:', newAdminEmail);
  console.log('🔑 Password:', newAdminPassword);
  console.log('👤 User ID:', admin.id);
  console.log('🎭 Role:', admin.role);
}

createNewAdmin()
  .catch((e) => {
    console.error('❌ Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });