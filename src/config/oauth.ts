// src/config/oauth.ts
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

// ============================================
// GOOGLE OAUTH STRATEGY
// ============================================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    scope: ['profile', 'email'], // Add scope here
    passReqToCallback: false
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const userProfile = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: profile.displayName,
        authProvider: 'google'
      };
      return done(null, userProfile);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// ============================================
// FACEBOOK OAUTH STRATEGY
// ============================================
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
    profileFields: ['id', 'emails', 'name'],
    enableProof: true
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const userProfile = {
        facebookId: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
        authProvider: 'facebook'
      };
      return done(null, userProfile);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

export default passport;










