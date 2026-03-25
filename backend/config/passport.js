const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'mock',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock',
        callbackURL: '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ email: newUser.email });

          if (user) {
             if (!user.googleId) {
                user.googleId = newUser.googleId;
                await user.save();
             }
             done(null, user);
          } else {
             user = await User.create(newUser);
             done(null, user);
          }
        } catch (error) {
          console.error(error);
          done(error, null);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'mock',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock',
        callbackURL: '/api/auth/github/callback',
        proxy: true,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        
        const newUser = {
          githubId: profile.id,
          name: profile.displayName || profile.username || 'GitHub User',
          email: email || `${profile.username}@github.com`,
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
        };

        try {
          let user = await User.findOne({ email: newUser.email });

          if (user) {
             if (!user.githubId) {
                user.githubId = newUser.githubId;
                await user.save();
             }
             done(null, user);
          } else {
             user = await User.create(newUser);
             done(null, user);
          }
        } catch (error) {
          console.error(error);
          done(error, null);
        }
      }
    )
  );
};
