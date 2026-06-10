import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function fixUser(email: string, password: string) {
  console.log(`🔍 Checking user: ${email}`);
  
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user) {
    console.error('❌ User not found');
    return;
  }

  console.log('👤 User found:');
  console.log(`   - ID: ${user.id}`);
  console.log(`   - Role: ${user.role}`);
  console.log(`   - Auth Provider: ${user.auth_provider}`);
  console.log(`   - Password Hash: ${user.password_hash ? 'SET' : 'NULL (Social Login Mode)'}`);

  if (!user.password_hash || user.auth_provider !== 'email') {
    console.log('🛠 Fixing user account...');
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        auth_provider: 'email'
      }
    });
    
    console.log('✅ User account fixed! They can now log in with email/password.');
  } else {
    console.log('⚠️ User already has a password hash set. No fix needed.');
  }
}

const email = 'one@gmail.com';
const password = 'Oneonw123'; // Using the password from the logs

fixUser(email, password)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
