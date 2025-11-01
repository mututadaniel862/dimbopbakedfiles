// src/routes/auth.ts
import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth/controller';
import { authenticate } from '../middlewares/auth';

export default async (app: FastifyInstance) => {
  // ============================================
  // SEED ROUTE (Run once to create predefined users)
  // ============================================
  app.post('/seed', authController.seedUsers);
  
  // ============================================
  // OTP MANAGEMENT
  // ============================================
  app.post('/otp/request', authController.requestOTP);
  app.post('/otp/verify', authController.verifyOTPCode);
  
  // ============================================
  // REGISTRATION
  // ============================================
  // Client Admin (Merchant) Registration - Google Sign-up
  app.post('/register/client-admin', authController.registerClientAdmin);
  
  // Client (Customer) Registration - Social or Email with OTP
  app.post('/register/client', authController.registerClient);
  
  // ============================================
  // LOGIN (All user types)
  // ============================================
  app.post('/login', authController.login);
  
  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================
  app.post('/change-password', { preHandler: [authenticate] }, authController.changePassword);
  app.post('/forgot-password', authController.forgotPassword);
  app.post('/reset-password', authController.resetPassword);

  // ============================================
  // USER MANAGEMENT
  // ============================================
  app.get('/user', authController.getUser);
  app.get('/users', { preHandler: [authenticate] }, authController.getAllUsers);
  app.delete('/users/:id', { preHandler: [authenticate] }, authController.deleteUser);

  // ============================================
  // API DOCUMENTATION & EXAMPLES
  // ============================================
  /*
  
  🌱 SEED PREDEFINED USERS (Run once)
  POST /api/auth/seed
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  📧 REQUEST OTP (For email registration)
  POST /api/auth/otp/request
  Body: {
    "email": "customer@example.com",
    "purpose": "registration"
  }
  
  ✅ VERIFY OTP
  POST /api/auth/otp/verify
  Body: {
    "email": "customer@example.com",
    "otp": "123456"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🏪 REGISTER CLIENT ADMIN (MERCHANT) - Google Sign-up
  POST /api/auth/register/client-admin
  Body: {
    "merchantName": "Dan's Dental Clinic",
    "email": "dan@dentalclinic.com",
    "phone": "+263771234567",
    "physicalAddress": "123 Main St, Harare",
    "geoLocation": {
      "latitude": -17.8252,
      "longitude": 31.0335
    },
    "authProvider": "google",
    "googleId": "google_user_id_here",
    "role": "client_admin"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  👤 REGISTER CLIENT (CUSTOMER) - Google
  POST /api/auth/register/client
  Body: {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+263772345678",
    "authProvider": "google",
    "googleId": "google_user_id_here",
    "role": "client"
  }
  
  👤 REGISTER CLIENT (CUSTOMER) - Apple
  POST /api/auth/register/client
  Body: {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+263773456789",
    "authProvider": "apple",
    "appleId": "apple_user_id_here",
    "role": "client"
  }
  
  👤 REGISTER CLIENT (CUSTOMER) - Facebook
  POST /api/auth/register/client
  Body: {
    "name": "Mike Johnson",
    "email": "mike@example.com",
    "phone": "+263774567890",
    "authProvider": "facebook",
    "facebookId": "facebook_user_id_here",
    "role": "client"
  }
  
  👤 REGISTER CLIENT (CUSTOMER) - Email with OTP
  Step 1: Request OTP (POST /api/auth/otp/request)
  Step 2: Verify OTP (POST /api/auth/otp/verify)
  Step 3: Register (POST /api/auth/register/client)
  Body: {
    "name": "Sarah Williams",
    "email": "sarah@example.com",
    "phone": "+263775678901",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "authProvider": "email",
    "role": "client"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🔐 LOGIN EXAMPLES
  
  Super Admin (First time - must provide phone):
  POST /api/auth/login
  Body: {
    "username": "super_admin",
    "password": "SAdm%2025!G7kL",
    "phone": "+263771234567",
    "role": "super_admin"
  }
  
  Super Admin (Subsequent logins):
  POST /api/auth/login
  Body: {
    "username": "super_admin",
    "password": "SAdm%2025!G7kL",
    "role": "super_admin"
  }
  
  Digital Marketer Admin:
  POST /api/auth/login
  Body: {
    "username": "dmark_alpha",
    "password": "DMkt!Alpha2025#",
    "role": "digital_marketer_admin"
  }
  
  Client Admin (Merchant) - Google:
  POST /api/auth/login
  Body: {
    "email": "dan@dentalclinic.com",
    "authProvider": "google",
    "googleId": "google_user_id_here",
    "role": "client_admin"
  }
  
  Client (Customer) - Google:
  POST /api/auth/login
  Body: {
    "email": "john@example.com",
    "authProvider": "google",
    "googleId": "google_user_id_here",
    "role": "client"
  }
  
  Client (Customer) - Apple:
  POST /api/auth/login
  Body: {
    "email": "jane@example.com",
    "authProvider": "apple",
    "appleId": "apple_user_id_here",
    "role": "client"
  }
  
  Client (Customer) - Facebook:
  POST /api/auth/login
  Body: {
    "email": "mike@example.com",
    "authProvider": "facebook",
    "facebookId": "facebook_user_id_here",
    "role": "client"
  }
  
  Client (Customer) - Email:
  POST /api/auth/login
  Body: {
    "email": "sarah@example.com",
    "password": "SecurePass123",
    "authProvider": "email",
    "role": "client"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🔒 PASSWORD MANAGEMENT
  
  Change Password (Requires authentication):
  POST /api/auth/change-password
  Headers: { Authorization: "Bearer <token>" }
  Body: {
    "currentPassword": "OldPass123",
    "newPassword": "NewPass456",
    "confirmNewPassword": "NewPass456"
  }
  
  Forgot Password:
  POST /api/auth/forgot-password
  Body: {
    "email": "user@example.com"
  }
  
  Reset Password:
  POST /api/auth/reset-password
  Body: {
    "token": "reset_token_from_email",
    "newPassword": "NewPass789",
    "confirmNewPassword": "NewPass789"
  }
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  👥 USER MANAGEMENT
  
  Get User:
  GET /api/auth/user?email=user@example.com
  
  Get All Users (Requires authentication):
  GET /api/auth/users
  Headers: { Authorization: "Bearer <token>" }
  
  Delete User (Requires authentication):
  DELETE /api/auth/users/:id
  Headers: { Authorization: "Bearer <token>" }
  
  */
};

















// // src/routes/auth.ts
// import { FastifyInstance } from 'fastify';
// import * as authController from '../controllers/auth/controller';
// import { authenticate } from '../middlewares/auth';

// export default async (app: FastifyInstance) => {
//   // ============================================
//   // SEED ROUTE (Run once to create predefined users)
//   // ============================================
//   app.post('/seed', authController.seedUsers);
  
//   // ============================================
//   // REGISTRATION (Only clients can register)
//   // ============================================
//   app.post('/register/client', authController.registerClient);
  
//   // ============================================
//   // LOGIN (All user types)
//   // ============================================
//   app.post('/login', authController.login);
  
//   // ============================================
//   // PASSWORD MANAGEMENT
//   // ============================================
//   app.post('/change-password', { preHandler: [authenticate] }, authController.changePassword);
//   app.post('/forgot-password', authController.forgotPassword);
//   app.post('/reset-password', authController.resetPassword);

//   // ============================================
//   // USER MANAGEMENT
//   // ============================================
//   app.get('/user', authController.getUser);
//   app.get('/users', { preHandler: [authenticate] }, authController.getAllUsers);
//   app.delete('/users/:id', { preHandler: [authenticate] }, authController.deleteUser);

//   // ============================================
//   // EXAMPLE USAGE:
//   // ============================================
//   // Seed users: POST http://localhost:3000/api/auth/seed
//   // 
//   // Register Client: POST http://localhost:3000/api/auth/register/client
//   // Body: { username, email, password, confirmPassword, phone, role: "client" }
//   //
//   // Login Super Admin (first time): POST http://localhost:3000/api/auth/login
//   // Body: { username: "super_admin_dan", password: "SAdm%2025!G7kL", phone: "+263771234567" }
//   //
//   // Login Digital Marketer: POST http://localhost:3000/api/auth/login
//   // Body: { username: "dmark_alpha", password: "DMkt!Alpha2025#" }
//   //
//   // Login Client Admin (first time): POST http://localhost:3000/api/auth/login
//   // Body: { username: "client_one", password: "Client!One2025$", phone: "+263772345678" }
//   //
//   // Login Client: POST http://localhost:3000/api/auth/login
//   // Body: { username: "their_username", password: "their_password" }
// };













// // import { FastifyInstance } from 'fastify';
// // import * as authController from '../controllers/auth/controller';
// // import { authenticate } from '../middlewares/auth';

// // export default async (app: FastifyInstance) => {
// //   app.post('/register', authController.register);
// //   app.post('/login', authController.login);
  
// //   // Protected routes
// //   app.post('/change-password', { preHandler: [authenticate] }, authController.changePassword); // Authorization Bearer
    
// //   app.post('/forgot-password', authController.forgotPassword);
// //   app.post('/reset-password', authController.resetPassword);

// //   // New route for getting a user by username or email
// //   app.get('/user', authController.getUser);
// //   // http://localhost:3000/api/auth/user?username=testuser


// //   app.get('/users', { preHandler: [authenticate] }, authController.getAllUsers); // Get all users (protected)
// //   // app.get('/users', authController.getAllUsers);
// //   app.delete('/users/:id', { preHandler: [authenticate] }, authController.deleteUser); // Delete user by ID (protected)

// //   // Example URLs:
// //   // Get user by username: http://localhost:3000/api/auth/user?username=testuser
// //   // Get user by email: http://localhost:3000/api/auth/user?email=test@example.com
// //   // Get all users: http://localhost:3000/api/auth/users
// //   // Delete user: http://localhost:3000/api/auth/users/123 (DELETE)
  
// // };