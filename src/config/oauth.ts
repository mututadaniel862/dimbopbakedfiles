// src/config/oauth.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://dimbopbakedfiles.onrender.com/api/oauth/google/callback',
      scope: ['profile', 'email'], // Request profile and email from Google
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('✅ Google OAuth Success - Profile received:', {
          id: profile.id,
          email: profile.emails?.[0]?.value,
          verified: profile.emails?.[0]?.verified,
          name: profile.displayName
        });

        // CRITICAL: Verify that Google confirmed the email
        const googleEmail = profile.emails?.[0];
        
        if (!googleEmail || !googleEmail.verified) {
          console.error('❌ Google email not verified or missing');
          return done(new Error('Google account email is not verified'), undefined);
        }

        // Extract verified Google data
        const verifiedData = {
          googleId: profile.id,
          email: googleEmail.value,
          name: profile.displayName || 'Google User',
          photo: profile.photos?.[0]?.value,
          emailVerified: googleEmail.verified
        };

        // Check if user exists
        let user = await prisma.users.findFirst({
          where: {
            OR: [
              { google_id: verifiedData.googleId },
              { email: verifiedData.email }
            ]
          }
        });

        if (user) {
          // Update Google ID if user exists but signed in with Google for first time
          if (!user.google_id) {
            user = await prisma.users.update({
              where: { id: user.id },
              data: {
                google_id: verifiedData.googleId,
                auth_provider: 'google',
                last_login: new Date()
              }
            });
          } else {
            // Just update last login
            user = await prisma.users.update({
              where: { id: user.id },
              data: { last_login: new Date() }
            });
          }
          
          console.log('✅ Existing user logged in via Google:', user.email);
        } else {
          // New user - we'll create them in the callback controller
          console.log('📝 New Google user - will be created in callback');
        }

        return done(null, { ...verifiedData, user });
      } catch (error) {
        console.error('❌ Google OAuth error:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
























// // src/config/oauth.ts
// import passport from 'passport';
// import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';

// // ============================================
// // GOOGLE OAUTH STRATEGY
// // ============================================
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     scope: ['profile', 'email'], // Add scope here
//     passReqToCallback: false
//   },
//   async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
//     try {
//       const userProfile = {
//         googleId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: profile.displayName,
//         authProvider: 'google'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error, undefined);
//     }
//   }
// ));

// // ============================================
// // FACEBOOK OAUTH STRATEGY
// // ============================================
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID!,
//     clientSecret: process.env.FACEBOOK_APP_SECRET!,
//     callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
//     profileFields: ['id', 'emails', 'name'],
//     enableProof: true
//   },
//   async (accessToken: string, refreshToken: string, profile: any, done: any) => {
//     try {
//       const userProfile = {
//         facebookId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
//         authProvider: 'facebook'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error, undefined);
//     }
//   }
// ));

// export default passport;










