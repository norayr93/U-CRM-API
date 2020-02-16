const {Router} = require('express');
const passport = require('passport');
const {pick} = require('lodash');
const {OK} = require('http-status-codes');
const {body, validationResult} = require('express-validator');

const router = Router();

router.post('/login', [
    body('username').exists(),
    body('password').exists(),
], (req, res, next) => {
    try {
        validationResult(req).throw();

        passport.authenticate('local', (err, user, info) => {
            if (user) {
                res.status(OK).send(pick(user.toObject(), ['_id', 'username']));
                return;
            }

            if (err) {
                next(err);
                return;
            }

            const message = info && info.message;
            res.status(400).json({status: 400, message});
        })(req, res, next);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;