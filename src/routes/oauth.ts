// src/routes/oauth.ts
import { FastifyInstance } from 'fastify';
import passport from '../config/oauth';
import { generateToken } from '../utils/jwt';
import * as authService from '../services/auth';

export default async (app: FastifyInstance) => {
  
  // ============================================
  // GOOGLE OAUTH
  // ============================================
  app.get('/google', async (request, reply) => {
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(request.raw, reply.raw);
  });

  app.get('/google/callback', async (request, reply) => {
    passport.authenticate('google', async (err: any, user: any) => {
      if (err || !user) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Google authentication failed' 
        });
      }

      try {
        // Check if user exists
        let existingUser = await authService.getUser({ email: user.email });

        if (!existingUser) {
          // Register new user
          existingUser = await authService.registerClient({
            name: user.name,
            email: user.email,
            phone: '', // They'll add phone later
            authProvider: 'google',
            googleId: user.googleId,
            role: 'client'
          });
        }

        const token = generateToken(existingUser as any);
        
        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        reply.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
      } catch (error: any) {
        reply.code(500).send({ 
          success: false, 
          error: error.message 
        });
      }
    })(request.raw, reply.raw);
  });

  // ============================================
  // FACEBOOK OAUTH
  // ============================================
  app.get('/facebook', async (request, reply) => {
    passport.authenticate('facebook', {
      scope: ['email']
    })(request.raw, reply.raw);
  });

  app.get('/facebook/callback', async (request, reply) => {
    passport.authenticate('facebook', async (err: any, user: any) => {
      if (err || !user) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Facebook authentication failed' 
        });
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
        reply.redirect(`${frontendUrl}/oauth/callback?token=${token}`);
      } catch (error: any) {
        reply.code(500).send({ 
          success: false, 
          error: error.message 
        });
      }
    })(request.raw, reply.raw);
  });

  // ============================================
  // APPLE OAUTH (COMMENTED OUT - ADD WHEN READY)
  // ============================================
  /*
  app.get('/apple', async (request, reply) => {
    passport.authenticate('apple')(request.raw, reply.raw);
  });

  app.post('/apple/callback', async (request, reply) => {
    passport.authenticate('apple', async (err: any, user: any) => {
      if (err || !user) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Apple authentication failed' 
        });
      }

      try {
        let existingUser = await authService.getUser({ email: user.email });

        if (!existingUser) {
          existingUser = await authService.registerClient({
            name: user.name,
            email: user.email,
            phone: '',
            authProvider: 'apple',
            appleId: user.appleId,
            role: 'client'
          });
        }

        const token = generateToken(existingUser as any);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        reply.redirect(`${frontendUrl}/auth/callback?token=${token}`);
      } catch (error: any) {
        reply.code(500).send({ 
          success: false, 
          error: error.message 
        });
      }
    })(request.raw, reply.raw);
  });
  */
};









