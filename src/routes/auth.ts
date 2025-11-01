// src/routes/oauth.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import passport from '../config/oauth';
import { generateToken } from '../utils/jwt';
import * as authService from '../services/auth';

export default async (app: FastifyInstance) => {
  
  // ============================================
  // GOOGLE OAUTH - INITIATE
  // ============================================
  app.get('/google', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Manually construct Google OAuth URL with proper scope
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      
      googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
      googleAuthUrl.searchParams.append('redirect_uri', process.env.GOOGLE_CALLBACK_URL!);
      googleAuthUrl.searchParams.append('response_type', 'code');
      googleAuthUrl.searchParams.append('scope', 'profile email');
      googleAuthUrl.searchParams.append('access_type', 'offline');
      googleAuthUrl.searchParams.append('prompt', 'consent');
      
      reply.redirect(googleAuthUrl.toString());
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: 'Failed to initiate Google authentication',
        details: error.message
      });
    }
  });

  // ============================================
  // GOOGLE OAUTH - CALLBACK
  // ============================================
  app.get('/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
    }, async (err: any, user: any, info: any) => {
      if (err) {
        console.error('Google OAuth Error:', err);
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_error`);
      }
      
      if (!user) {
        console.error('No user returned from Google');
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=no_user`);
      }

      try {
        // Check if user exists
        let existingUser = await authService.getUser({ email: user.email });

        if (!existingUser) {
          // Register new user
          console.log('Registering new user from Google:', user.email);
          existingUser = await authService.registerClient({
            name: user.name,
            email: user.email,
            phone: '', // They'll add phone later
            authProvider: 'google',
            googleId: user.googleId,
            role: 'client'
          });
        } else {
          console.log('Existing user found:', user.email);
        }

        // Generate JWT token
        const token = generateToken(existingUser as any);
        
        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        reply.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        }))}`);
      } catch (error: any) {
        console.error('Error processing Google callback:', error);
        reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message)}`);
      }
    })(request.raw, reply.raw);
  });

  // ============================================
  // FACEBOOK OAUTH - INITIATE
  // ============================================
  app.get('/facebook', async (request: FastifyRequest, reply: FastifyReply) => {
    passport.authenticate('facebook', {
      scope: ['email', 'public_profile']
    })(request.raw, reply.raw);
  });

  // ============================================
  // FACEBOOK OAUTH - CALLBACK
  // ============================================
  app.get('/facebook/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    passport.authenticate('facebook', { 
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=facebook_auth_failed`
    }, async (err: any, user: any) => {
      if (err || !user) {
        return reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }

      try {
        let existingUser = await authService.getUser({ email: user.email });

        if (!existingUser) {
          existingUser = await authService.registerClient({
            name: user.name,
            email: user.email,
            phone: '',
            authProvider: 'facebook',
            facebookId: user.facebookId,
            role: 'client'
          });
        }

        const token = generateToken(existingUser as any);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        reply.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        }))}`);
      } catch (error: any) {
        reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message)}`);
      }
    })(request.raw, reply.raw);
  });

  // ============================================
  // HEALTH CHECK FOR OAUTH
  // ============================================
  app.get('/oauth/status', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({
      success: true,
      providers: {
        google: {
          enabled: !!process.env.GOOGLE_CLIENT_ID,
          clientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing',
          callbackUrl: process.env.GOOGLE_CALLBACK_URL
        },
        facebook: {
          enabled: !!process.env.FACEBOOK_APP_ID,
          appId: process.env.FACEBOOK_APP_ID ? 'configured' : 'missing',
          callbackUrl: process.env.FACEBOOK_CALLBACK_URL
        }
      }
    });
  });
};

