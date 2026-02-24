"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const authController = __importStar(require("../controllers/auth/controller"));
const auth_1 = require("../middlewares/auth");
exports.default = async (app) => {
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
    // Client (Customer) Registration
    app.post('/register/client', authController.registerClient);
    // ============================================
    // LOGIN (All user types)
    // ============================================
    app.post('/login', authController.login);
    // ============================================
    // PASSWORD MANAGEMENT
    // ============================================
    app.post('/change-password', { preHandler: [auth_1.authenticate] }, authController.changePassword);
    app.post('/forgot-password', authController.forgotPassword);
    app.post('/reset-password', authController.resetPassword);
    // ============================================
    // USER MANAGEMENT
    // ============================================
    app.get('/user', authController.getUser);
    app.get('/users', { preHandler: [auth_1.authenticate] }, authController.getAllUsers);
    app.delete('/users/:id', { preHandler: [auth_1.authenticate] }, authController.deleteUser);
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
//# sourceMappingURL=auth.js.map