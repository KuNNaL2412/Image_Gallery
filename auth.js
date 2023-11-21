const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express');
const router = express.Router();
const User = require('./models/user'); // Import your User model

passport.use(new GoogleStrategy({
    clientID: '1068540920247-6220mok1dnktgr6k3iu50ae5e9pj07ku.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            // User already exists, return the user
            return done(null, existingUser);
        }

        // User doesn't exist, create a new user in the database
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            // Add other relevant user data here
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        done(null, savedUser);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to the home page or a dashboard
        res.redirect('/');
    }
);

module.exports = router;
