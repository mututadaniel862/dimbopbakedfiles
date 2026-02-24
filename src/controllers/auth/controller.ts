// src/controllers/auth/controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { 
  PREDEFINED_USERS,
  clientAdminRegisterSchema,
  clientRegisterSchema,
  loginSchema,
  requestOTPSchema,
  verifyOTPSchema
} from '../../utils/schemas';
import * as authService from '../../services/auth';
import { generateToken } from '../../utils/jwt';
import { users } from '@prisma/client';

// ============================================
// SEED PREDEFINED USERS
// ============================================
export const seedUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await authService.seedPredefinedUsers();
    
    reply.code(200).send({
      success: true,
      message: 'Predefined users seeded successfully',
      data: {
        super_admin: PREDEFINED_USERS.super_admin.username,
        digital_marketer_admins: PREDEFINED_USERS.digital_marketer_admins.map(u => u.username)
      }
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Seeding failed'
    });
  }
};

// ============================================
// OTP MANAGEMENT
// ============================================
export const requestOTP = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await authService.sendOTP(request.body);
    
    reply.code(200).send({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Failed to send OTP'
    });
  }
};

export const verifyOTPCode = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const isValid = await authService.verifyOTP(request.body);
    
    reply.code(200).send({
      success: true,
      message: 'OTP verified successfully',
      data: { verified: isValid }
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'OTP verification failed'
    });
  }
};

// ============================================
// CLIENT ADMIN (MERCHANT) REGISTRATION
// ============================================
export const registerClientAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = clientAdminRegisterSchema.parse(request.body);
    const user = await authService.registerClientAdmin(validatedData);
    
    const token = generateToken(user);
    
    reply.code(201).send({
      success: true,
      message: 'Merchant registered successfully',
      data: {
        user: {
          id: user.id,
          merchantName: user.merchant_name,
          email: user.email,
          phone: user.phone,
          physicalAddress: user.physical_address,
          geoLocation: {
            latitude: user.geo_latitude,
            longitude: user.geo_longitude
          },
          role: user.role
        },
        token
      }
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Merchant registration failed'
    });
  }
};

// ============================================
// CLIENT (CUSTOMER) REGISTRATION
// ============================================
export const registerClient = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = clientRegisterSchema.parse(request.body);
    
    // If email registration, verify OTP first (should be done by frontend)
    // This is// If email registration, verify OTP first (should be done by frontend)
    // This assumes OTP was already verified before reaching this endpoint
    
    const user = await authService.registerClient(validatedData);
    
    const token = generateToken(user);
    
    reply.code(201).send({
      success: true,
      message: 'Client registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          authProvider: user.auth_provider
        },
        token
      }
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Client registration failed'
    });
  }
};

// ============================================
// UNIVERSAL LOGIN
// ============================================
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validatedData = loginSchema.parse(request.body);
    const user = await authService.loginUser(validatedData);
    
    const token = generateToken(user);
    
    reply.code(200).send({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          merchantName: user.merchant_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          physicalAddress: user.physical_address,
          geoLocation: user.geo_latitude && user.geo_longitude ? {
            latitude: user.geo_latitude,
            longitude: user.geo_longitude
          } : null,
          authProvider: user.auth_provider,
          lastLogin: user.last_login
        },
        token
      }
    });
  } catch (error: any) {
    reply.code(401).send({
      success: false,
      error: error.message || 'Login failed'
    });
  }
};

// ============================================
// PASSWORD MANAGEMENT
// ============================================
export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = request.user as users;
    
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string;
      newPassword: string;
    };

    await authService.changePassword(user.id, currentPassword, newPassword);
    
    reply.code(200).send({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password change failed'
    });
  }
};

export const forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email } = request.body as { email: string };
    await authService.forgotPassword(email);
    
    reply.code(200).send({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password reset failed'
    });
  }
};

export const resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { token, newPassword } = request.body as { token: string; newPassword: string };
    await authService.resetPassword(token, newPassword);
    
    reply.code(200).send({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error: any) {
    reply.code(400).send({
      success: false,
      error: error.message || 'Password reset failed'
    });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { username, email } = request.query as { username?: string; email?: string };

    if (!username && !email) {
      return reply.code(400).send({ success: false, error: 'Username or email required' });
    }

    const user = await authService.getUser({ username, email });
    if (!user) {
      return reply.code(404).send({ success: false, error: 'User not found' });
    }

    reply.code(200).send({
      success: true,
      data: user
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch user'
    });
  }
};

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await authService.getAllUsers();
    
    reply.code(200).send({
      success: true,
      data: users
    });
  } catch (error: any) {
    reply.code(500).send({
      success: false,
      error: error.message || 'Failed to fetch users'
    });
  }
};

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const userIdToDelete = parseInt(id);

    if (isNaN(userIdToDelete)) {
      return reply.code(400).send({ success: false, error: 'Invalid user ID' });
    }

    await authService.deleteUser(userIdToDelete);
    
    reply.code(200).send({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    reply.code(statusCode).send({
      success: false,
      error: error.message || 'Failed to delete user'
    });
  }
};


















// // src/controllers/auth/controller.ts
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { 
//   PREDEFINED_USERS,
//   clientRegisterSchema,
//   loginSchema, 
//   changePasswordSchema,
//   resetPasswordSchema,
//   forgotPasswordSchema
// } from '../../utils/schemas';
// import * as authService from '../../services/auth';
// import { generateToken } from '../../utils/jwt';
// import { users } from '@prisma/client';

// // ============================================
// // SEED PREDEFINED USERS
// // ============================================
// export const seedUsers = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     await authService.seedPredefinedUsers();
    
//     reply.code(200).send({
//       success: true,
//       message: 'Predefined users seeded successfully',
//       data: {
//         super_admin: PREDEFINED_USERS.super_admin.username,
//         digital_marketer_admins: PREDEFINED_USERS.digital_marketer_admins.map(u => u.username),
//         client_admin: PREDEFINED_USERS.client_admin.username
//       }
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Seeding failed'
//     });
//   }
// };

// // ============================================
// // CLIENT REGISTRATION (100% self-created)
// // ============================================
// export const registerClient = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const validatedData = clientRegisterSchema.parse(request.body);
//     const user = await authService.registerClient(validatedData);
    
//     const token = generateToken(user);
    
//     reply.code(201).send({
//       success: true,
//       message: 'Client registered successfully',
//       data: {
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           phone: user.phone,
//           role: user.role
//         },
//         token
//       }
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Client registration failed'
//     });
//   }
// };

// // ============================================
// // UNIVERSAL LOGIN
// // ============================================
// export const login = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const validatedData = loginSchema.parse(request.body);
//     const user = await authService.loginUser(validatedData);
    
//     const token = generateToken(user);
    
//     reply.code(200).send({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           phone: user.phone,
//           role: user.role
//         },
//         token
//       }
//     });
//   } catch (error: any) {
//     reply.code(401).send({
//       success: false,
//       error: error.message || 'Login failed'
//     });
//   }
// };

// // ============================================
// // PASSWORD MANAGEMENT
// // ============================================
// export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
    
//     const { currentPassword, newPassword } = request.body as {
//       currentPassword: string;
//       newPassword: string;
//     };

//     await authService.changePassword(user.id, currentPassword, newPassword);
    
//     reply.code(200).send({
//       success: true,
//       message: 'Password changed successfully'
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Password change failed'
//     });
//   }
// };

// export const forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const validatedData = forgotPasswordSchema.parse(request.body);
//     await authService.forgotPassword(validatedData.email);
    
//     reply.code(200).send({
//       success: true,
//       message: 'If an account with that email exists, a reset link has been sent'
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Password reset failed'
//     });
//   }
// };

// export const resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const validatedData = resetPasswordSchema.parse(request.body);
//     await authService.resetPassword(validatedData);
    
//     reply.code(200).send({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Password reset failed'
//     });
//   }
// };

// // ============================================
// // USER MANAGEMENT
// // ============================================
// export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { username, email } = request.query as { username?: string; email?: string };

//     if (!username && !email) {
//       return reply.code(400).send({ success: false, error: 'Username or email required' });
//     }

//     const user = await authService.getUser({ username, email });
//     if (!user) {
//       return reply.code(404).send({ success: false, error: 'User not found' });
//     }

//     reply.code(200).send({
//       success: true,
//       data: user
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to fetch user'
//     });
//   }
// };

// export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const users = await authService.getAllUsers();
    
//     reply.code(200).send({
//       success: true,
//       data: users
//     });
//   } catch (error: any) {
//     reply.code(500).send({
//       success: false,
//       error: error.message || 'Failed to fetch users'
//     });
//   }
// };

// export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const { id } = request.params as { id: string };
//     const userIdToDelete = parseInt(id);

//     if (isNaN(userIdToDelete)) {
//       return reply.code(400).send({ success: false, error: 'Invalid user ID' });
//     }

//     await authService.deleteUser(userIdToDelete);
    
//     reply.code(200).send({
//       success: true,
//       message: 'User deleted successfully'
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('not found') ? 404 : 500;
//     reply.code(statusCode).send({
//       success: false,
//       error: error.message || 'Failed to delete user'
//     });
//   }
// };
















