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














// // src/config/oauth.ts
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// // Remove Apple for now - we'll add it later if needed
// // import AppleStrategy from 'passport-apple';

// // ============================================
// // GOOGLE OAUTH STRATEGY
// // ============================================
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL!
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const userProfile = {
//         googleId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: profile.displayName,
//         authProvider: 'google'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
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
//     profileFields: ['id', 'emails', 'name']
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const userProfile = {
//         facebookId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
//         authProvider: 'facebook'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
//     }
//   }
// ));

// // ============================================
// // APPLE OAUTH STRATEGY (COMMENTED OUT FOR NOW)
// // ============================================
// // Uncomment this when you have Apple credentials ready
// /*
// import AppleStrategy from 'passport-apple';

// passport.use(new AppleStrategy({
//     clientID: process.env.APPLE_CLIENT_ID!,
//     teamID: process.env.APPLE_TEAM_ID!,
//     keyID: process.env.APPLE_KEY_ID!,
//     privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH!,
//     callbackURL: process.env.APPLE_CALLBACK_URL!
//   },
//   async (accessToken: any, refreshToken: any, idToken: any, profile: any, done: any) => {
//     try {
//       const userProfile = {
//         appleId: profile.id,
//         email: profile.email || '',
//         name: `${profile.name?.firstName || ''} ${profile.name?.lastName || ''}`.trim(),
//         authProvider: 'apple'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
//     }
//   }
// ));
// */

// export default passport;





















// // src/config/oauth.ts
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import AppleStrategy from 'passport-apple';

// // ============================================
// // GOOGLE OAUTH STRATEGY
// // ============================================
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL!
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const userProfile = {
//         googleId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: profile.displayName,
//         authProvider: 'google'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
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
//     profileFields: ['id', 'emails', 'name']
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const userProfile = {
//         facebookId: profile.id,
//         email: profile.emails?.[0]?.value || '',
//         name: `${profile.name?.givenName} ${profile.name?.familyName}`,
//         authProvider: 'facebook'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
//     }
//   }
// ));

// // ============================================
// // APPLE OAUTH STRATEGY
// // ============================================
// passport.use(new AppleStrategy({
//     clientID: process.env.APPLE_CLIENT_ID!,
//     teamID: process.env.APPLE_TEAM_ID!,
//     keyID: process.env.APPLE_KEY_ID!,
//     privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH!,
//     callbackURL: process.env.APPLE_CALLBACK_URL!
//   },
//   async (accessToken, refreshToken, idToken, profile, done) => {
//     try {
//       const userProfile = {
//         appleId: profile.id,
//         email: profile.email || '',
//         name: `${profile.name?.firstName || ''} ${profile.name?.lastName || ''}`.trim(),
//         authProvider: 'apple'
//       };
//       return done(null, userProfile);
//     } catch (error) {
//       return done(error as Error);
//     }
//   }
// ));

// export default passport;