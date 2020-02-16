const passport = require('passport');

const init = app => {
    app.use(passport.initialize());
    app.use(passport.session());
};

module.exports = init;