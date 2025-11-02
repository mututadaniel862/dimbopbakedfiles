// src/routes/oauth.ts
import { FastifyInstance } from 'fastify';
import passport from '../config/oauth';
import { generateToken } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (app: FastifyInstance) => {
  // ============================================
  // GOOGLE OAUTH - INITIATE (Client Admin Registration)
  // ============================================
  app.get('/google', async (request, reply) => {
    console.log('🔐 Initiating Google OAuth for Client Admin...');
    
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      accessType: 'offline',
      prompt: 'consent'
    })(request.raw, reply.raw, (err: any) => {
      if (err) {
        console.error('❌ Google OAuth initiation error:', err);
        reply.code(500).send({ error: 'Failed to initiate Google login' });
      }
    });
  });

  // ============================================
  // GOOGLE OAUTH - CALLBACK (Verify and Create User)
  // ============================================
  app.get('/google/callback', async (request, reply) => {
    console.log('📡 Google OAuth callback received');

    passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    }, async (err: Error | null, profile: any) => {
      if (err) {
        console.error('❌ Google authentication failed:', err);
        return reply.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
      }

      if (!profile) {
        console.error('❌ No profile returned from Google');
        return reply.redirect(`${process.env.FRONTEND_URL}/login?error=no_profile`);
      }

      try {
        // CRITICAL VALIDATION: Ensure email is verified by Google
        if (!profile.emailVerified) {
          console.error('❌ Google email not verified:', profile.email);
          return reply.redirect(`${process.env.FRONTEND_URL}/login?error=email_not_verified`);
        }

        // CRITICAL: Check that Google ID exists (proves it's a real Google account)
        if (!profile.googleId) {
          console.error('❌ No Google ID provided - not a valid Google account');
          return reply.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_google_account`);
        }

        console.log('✅ Google account verified:', {
          googleId: profile.googleId,
          email: profile.email,
          verified: profile.emailVerified
        });

        let user = profile.user;

        // If user doesn't exist, create new client_admin (merchant)
        if (!user) {
          console.log('📝 Creating new client_admin from Google account');
          
          user = await prisma.users.create({
            data: {
              merchant_name: profile.name,
              email: profile.email,
              phone: null, // Will be collected later
              google_id: profile.googleId,
              auth_provider: 'google',
              role: 'client_admin',
              password_hash: null, // Google users don't have passwords
              physical_address: null, // To be collected after registration
              geo_latitude: null,
              geo_longitude: null,
              last_login: new Date()
            }
          });

          console.log('✅ New client_admin created:', user.email);
        }

        // Generate JWT token
        const token = generateToken(user);

        console.log('✅ Redirecting to frontend with token');
        
        // Redirect to frontend with token
        reply.redirect(`${process.env.FRONTEND_URL}/oauth/callback?token=${token}`);
      } catch (error: any) {
        console.error('❌ Error in Google callback:', error);
        reply.redirect(`${process.env.FRONTEND_URL}/login?error=registration_failed`);
      }
    })(request.raw, reply.raw);
  });

  // ============================================
  // APPLE OAUTH (Optional - similar pattern)
  // ============================================
  // TODO: Implement Apple OAuth with similar verification

  // ============================================
  // FACEBOOK OAUTH (Optional - similar pattern)
  // ============================================
  // TODO: Implement Facebook OAuth with similar verification
};













// // src/routes/oauth.ts
// import { FastifyInstance } from 'fastify';
// import passport from '../config/oauth';
// import { generateToken } from '../utils/jwt';
// import * as authService from '../services/auth';

// export default async (app: FastifyInstance) => {
  
//   // ============================================
//   // GOOGLE OAUTH
//   // ============================================
//   app.get('/google', async (request, reply) => {
//     passport.authenticate('google', {
//       scope: ['profile', 'email']
//     })(request.raw, reply.raw);
//   });

//   app.get('/google/callback', async (request, reply) => {
//     passport.authenticate('google', async (err: any, user: any) => {
//       if (err || !user) {
//         return reply.code(401).send({ 
//           success: false, 
//           error: 'Google authentication failed' 
//         });
//       }

//       try {
//         // Check if user exists
//         let existingUser = await authService.getUser({ email: user.email });

//         if (!existingUser) {
//           // Register new user
//           existingUser = await authService.registerClient({
//             name: user.name,
//             email: user.email,
//             phone: '', // They'll add phone later
//             authProvider: 'google',
//             googleId: user.googleId,
//             role: 'client'
//           });
//         }

//         const token = generateToken(existingUser as any);
        
//         // Redirect to frontend with token
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//         reply.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
//       } catch (error: any) {
//         reply.code(500).send({ 
//           success: false, 
//           error: error.message 
//         });
//       }
//     })(request.raw, reply.raw);
//   });

//   // ============================================
//   // FACEBOOK OAUTH
//   // ============================================
//   app.get('/facebook', async (request, reply) => {
//     passport.authenticate('facebook', {
//       scope: ['email']
//     })(request.raw, reply.raw);
//   });

//   app.get('/facebook/callback', async (request, reply) => {
//     passport.authenticate('facebook', async (err: any, user: any) => {
//       if (err || !user) {
//         return reply.code(401).send({ 
//           success: false, 
//           error: 'Facebook authentication failed' 
//         });
//       }

//       try {
//         let existingUser = await authService.getUser({ email: user.email });

//         if (!existingUser) {
//           existingUser = await authService.registerClient({
//             name: user.name,
//             email: user.email,
//             phone: '',
//             authProvider: 'facebook',
//             facebookId: user.facebookId,
//             role: 'client'
//           });
//         }

//         const token = generateToken(existingUser as any);
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//         reply.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
//       } catch (error: any) {
//         reply.code(500).send({ 
//           success: false, 
//           error: error.message 
//         });
//       }
//     })(request.raw, reply.raw);
//   });

//   // ============================================
//   // APPLE OAUTH (COMMENTED OUT - ADD WHEN READY)
//   // ============================================
//   /*
//   app.get('/apple', async (request, reply) => {
//     passport.authenticate('apple')(request.raw, reply.raw);
//   });

//   app.post('/apple/callback', async (request, reply) => {
//     passport.authenticate('apple', async (err: any, user: any) => {
//       if (err || !user) {
//         return reply.code(401).send({ 
//           success: false, 
//           error: 'Apple authentication failed' 
//         });
//       }

//       try {
//         let existingUser = await authService.getUser({ email: user.email });

//         if (!existingUser) {
//           existingUser = await authService.registerClient({
//             name: user.name,
//             email: user.email,
//             phone: '',
//             authProvider: 'apple',
//             appleId: user.appleId,
//             role: 'client'
//           });
//         }

//         const token = generateToken(existingUser as any);
//         const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
//         reply.redirect(`${frontendUrl}/auth/callback?token=${token}`);
//       } catch (error: any) {
//         reply.code(500).send({ 
//           success: false, 
//           error: error.message 
//         });
//       }
//     })(request.raw, reply.raw);
//   });
//   */
// };









