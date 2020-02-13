const {Router} = require('express');
const {check, body, param, validationResult} = require('express-validator');
const router = Router();

router.get('/', [
    body('date_start').optional(),
    body('date_end').optional(),
    body('name').optional(),
], async (req, res, next) => {
    try {
        res.status(OK).send({});
    } catch (err) {
        return next(err);
    }
});

router.post('/', [
    body('date_start').optional(),
    body('date_end').optional(),
    body('name').optional(),
], async (req, res, next) => {
    try {
        validationResult(req).throw();
        res.status(OK).send({});
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', [
    body('date_start').optional(),
    body('date_end').optional(),
    body('name').optional(),
], async (req, res, next) => {
    try {
        res.status(OK).send({});
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', [
    body('date_start').optional(),
    body('date_end').optional(),
    body('name').optional(),
], async (req, res, next) => {
    try {
        res.status(OK).send({});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;