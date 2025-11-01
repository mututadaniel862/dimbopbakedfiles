// src/services/authService.ts
import { PrismaClient, users } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { 
  PREDEFINED_USERS,
  clientAdminRegisterSchema,
  clientRegisterSchema,
  loginSchema,
  requestOTPSchema,
  verifyOTPSchema,
  generateOTP
} from '../utils/schemas';
import { sendOTPEmail, sendPasswordResetEmail } from './emailService'; // Add this import

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 10;

// ============================================
// SEED PREDEFINED USERS (ONLY SUPER ADMIN & DIGITAL MARKETERS)
// ============================================
export const seedPredefinedUsers = async (): Promise<void> => {
  console.log('🌱 Seeding predefined users...');

  try {
    // 1. Seed Super Admin
    const superAdminExists = await prisma.users.findUnique({
      where: { username: PREDEFINED_USERS.super_admin.username }
    });

    if (!superAdminExists) {
      await prisma.users.create({
        data: {
          username: PREDEFINED_USERS.super_admin.username,
          email: PREDEFINED_USERS.super_admin.email,
          phone: null,
          password_hash: await bcrypt.hash(PREDEFINED_USERS.super_admin.password, SALT_ROUNDS),
          role: PREDEFINED_USERS.super_admin.role,
          auth_provider: 'email'
        }
      });
      console.log('✅ Super Admin created:', PREDEFINED_USERS.super_admin.username);
    }

    // 2. Seed Digital Marketer Admins
    for (const dmarketer of PREDEFINED_USERS.digital_marketer_admins) {
      const exists = await prisma.users.findUnique({
        where: { username: dmarketer.username }
      });

      if (!exists) {
        await prisma.users.create({
          data: {
            username: dmarketer.username,
            email: dmarketer.email,
            phone: dmarketer.phone,
            password_hash: await bcrypt.hash(dmarketer.password, SALT_ROUNDS),
            role: dmarketer.role,
            auth_provider: 'email'
          }
        });
        console.log(`✅ Digital Marketer Admin created: ${dmarketer.username}`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// ============================================
// OTP MANAGEMENT
// ============================================
export const sendOTP = async (data: any): Promise<void> => {
  const { email, purpose } = requestOTPSchema.parse(data);
  
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  // Store OTP in database
  await prisma.otps.create({
    data: {
      email,
      otp_code: otp,
      purpose,
      expires_at: expiresAt
    }
  });
  
  // Send OTP via email
  await sendOTPEmail(email, otp);
  console.log(`📧 OTP sent to ${email}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} minutes)`);
};

export const verifyOTP = async (data: any): Promise<boolean> => {
  const { email, otp } = verifyOTPSchema.parse(data);
  
  const otpRecord = await prisma.otps.findFirst({
    where: {
      email,
      otp_code: otp,
      expires_at: { gt: new Date() },
      is_used: false
    },
    orderBy: { created_at: 'desc' }
  });
  
  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }
  
  // Mark OTP as used
  await prisma.otps.update({
    where: { id: otpRecord.id },
    data: { is_used: true }
  });
  
  return true;
};

// ============================================
// CLIENT ADMIN (MERCHANT) REGISTRATION
// ============================================
export const registerClientAdmin = async (data: any): Promise<users> => {
  const { merchantName, email, phone, physicalAddress, geoLocation, authProvider, googleId } = 
    clientAdminRegisterSchema.parse(data);

  // Check if merchant already exists
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        { email },
        { phone }
      ]
    }
  });
  
  if (existingUser) {
    if (existingUser.email === email) throw new Error('Email already in use');
    if (existingUser.phone === phone) throw new Error('Phone number already in use');
  }
  
  // Create client admin (merchant) - FIX: Convert undefined to null
  const user = await prisma.users.create({
    data: {
      merchant_name: merchantName,
      email,
      phone,
      physical_address: physicalAddress,
      geo_latitude: geoLocation.latitude,
      geo_longitude: geoLocation.longitude,
      role: 'client_admin',
      auth_provider: authProvider,
      google_id: googleId || null, // FIX: undefined to null
      password_hash: null,
      last_login: new Date()
    }
  });
  
  return user;
};

// ============================================
// CLIENT (CUSTOMER) REGISTRATION
// ============================================
export const registerClient = async (data: any): Promise<users> => {
  const { name, email, phone, authProvider, password, googleId, appleId, facebookId } = 
    clientRegisterSchema.parse(data);

  // Check if user already exists
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        { email },
        { phone }
      ]
    }
  });
  
  if (existingUser) {
    if (existingUser.email === email) throw new Error('Email already in use');
    if (existingUser.phone === phone) throw new Error('Phone number already in use');
  }
  
  // Hash password only if using email auth
  let hashedPassword = null;
  if (authProvider === 'email' && password) {
    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  }
  
  // Create client user - FIX: Convert undefined to null
  const user = await prisma.users.create({
    data: {
      name,
      email,
      phone,
      password_hash: hashedPassword,
      role: 'client',
      auth_provider: authProvider,
      google_id: googleId || null, // FIX: undefined to null
      apple_id: appleId || null,   // FIX: undefined to null
      facebook_id: facebookId || null // FIX: undefined to null
    }
  });
  
  return user;
};

// ============================================
// UNIVERSAL LOGIN
// ============================================
export const loginUser = async (data: any): Promise<users> => {
  const { username, email, password, phone, authProvider, googleId, appleId, facebookId, role } = 
    loginSchema.parse(data);
  
  // Build query based on auth provider
  let whereClause: any = {};
  
  if (authProvider === 'google' && googleId) {
    whereClause = { google_id: googleId };
  } else if (authProvider === 'apple' && appleId) {
    whereClause = { apple_id: appleId };
  } else if (authProvider === 'facebook' && facebookId) {
    whereClause = { facebook_id: facebookId };
  } else if (username) {
    whereClause = { username };
  } else if (email) {
    whereClause = { email };
  }
  
  if (role) {
    whereClause.role = role;
  }
  
  const user = await prisma.users.findFirst({
    where: whereClause
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check password only for email auth
  if (authProvider === 'email' || (!authProvider && password)) {
    if (!user.password_hash) {
      throw new Error('This account uses social login');
    }
    
    const passwordMatch = await bcrypt.compare(password!, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
  }

  // Check if login is required (every 15 days for client_admins)
  if (user.role === 'client_admin') {
    const daysSinceLastLogin = user.last_login 
      ? Math.floor((Date.now() - user.last_login.getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    if (daysSinceLastLogin > 15) {
      // Update last login
      await prisma.users.update({
        where: { id: user.id },
        data: { last_login: new Date() }
      });
    }
  }

  // Update phone if needed
  if (!user.phone && phone) {
    const phoneInUse = await prisma.users.findFirst({
      where: { phone }
    });

    if (phoneInUse) {
      throw new Error('Phone number already in use');
    }

    return await prisma.users.update({
      where: { id: user.id },
      data: { phone, last_login: new Date() }
    });
  }

  // Update last login
  await prisma.users.update({
    where: { id: user.id },
    data: { last_login: new Date() }
  });
  
  return user;
};

// ============================================
// GET USER FUNCTIONS
// ============================================
export const getUser = async (identifier: { 
  username?: string | undefined; 
  email?: string | undefined;
  phone?: string | undefined;
}): Promise<any | null> => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [
        identifier.username !== undefined ? { username: identifier.username } : {},
        identifier.email !== undefined ? { email: identifier.email } : {},
        identifier.phone !== undefined ? { phone: identifier.phone } : {}
      ].filter(obj => Object.keys(obj).length > 0) // FIX: Better filtering
    },
    select: {
      id: true,
      username: true,
      name: true,
      merchant_name: true,
      email: true,
      phone: true,
      role: true,
      physical_address: true,
      geo_latitude: true,
      geo_longitude: true,
      auth_provider: true
    }
  });
  
  return user;
};

export const getAllUsers = async (): Promise<any[]> => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      merchant_name: true,
      email: true,
      phone: true,
      role: true,
      physical_address: true,
      geo_latitude: true,
      geo_longitude: true,
      auth_provider: true,
      created_at: true,
      updated_at: true,
      last_login: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  
  return users;
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================
export const changePassword = async (
  userId: number, 
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  if (user.auth_provider !== 'email') {
    throw new Error('Cannot change password for social login accounts');
  }
  
  if (!user.password_hash) {
    throw new Error('This account uses social login');
  }
  
  const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!passwordMatch) {
    throw new Error('Current password is incorrect');
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.users.update({
    where: { id: userId },
    data: { password_hash: hashedPassword }
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { email }
  });
  
  if (!user || user.auth_provider !== 'email') {
    return; // Don't reveal if user exists
  }
  
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000);
  
  await prisma.password_resets.create({
    data: {
      user_id: user.id,
      reset_token: token,
      created_at: expiresAt
    }
  });
  
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetLink);
  console.log(`🔐 Password reset link sent to: ${email}`);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetRecord = await prisma.password_resets.findFirst({
    where: {
      reset_token: token,
      created_at: { gt: new Date(Date.now() - 3600000) }
    },
    include: { users: true }
  });

  if (!resetRecord || !resetRecord.user_id) { // FIX: Check for null user_id
    throw new Error('Invalid or expired token');
  }

  await prisma.$transaction([
    prisma.users.update({
      where: { id: resetRecord.user_id }, // Now TypeScript knows it's not null
      data: { 
        password_hash: await bcrypt.hash(newPassword, SALT_ROUNDS) 
      }
    }),
    prisma.password_resets.deleteMany({
      where: { user_id: resetRecord.user_id }
    })
  ]);
};

// ============================================
// USER MANAGEMENT
// ============================================
export const deleteUser = async (userId: number): Promise<void> => {
  const user = await prisma.users.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  await prisma.$transaction([
    prisma.password_resets.deleteMany({
      where: { user_id: userId }
    }),
    prisma.otps.deleteMany({
      where: { email: user.email }
    }),
    prisma.users.delete({
      where: { id: userId }
    })
  ]);
};