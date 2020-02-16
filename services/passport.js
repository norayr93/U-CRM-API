const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({username: 'email'}, (email, password, done) => {
            User.findOne({username: email})
            .then(async user => {
                if (!user) {
                    const hash = bcrypt.hashSync(password, 11);
                    const newUser = await User.create({username: email, password: hash});
                    return done(null, newUser);
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Incorrect password'});
                    }
                });
            });
        }),
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
  };