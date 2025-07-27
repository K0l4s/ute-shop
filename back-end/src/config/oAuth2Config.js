const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');
const User = db.User;
const Wallet = db.Wallet;

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = await User.findOne({
      where: { email: profile.emails[0].value }
    });

    if (existingUser) {
      // User exists, update Google ID if not set
      if (!existingUser.google_id) {
        await existingUser.update({
          google_id: profile.id,
          avatar_url: profile.photos[0]?.value || existingUser.avatar_url
        });
      }
      return done(null, existingUser);
    }

    // Create new user
    const newUser = await User.create({
      google_id: profile.id,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      email: profile.emails[0].value,
      avatar_url: null,
      is_active: true,
      phone: null,
      address: null,
      birthday: null,
      password: null,
      createAt: new Date(),
      updateAt: new Date()
    });

    // Create wallet for new user
    await Wallet.create({
      userId: newUser.id,
      coins: 0,
    });

    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;