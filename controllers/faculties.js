const {Router} = require('express');
const {OK} = require('http-status-codes');
const {BadRequestError} = require('../helpers/error');
const {body, param, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Faculty = mongoose.model('Faculty');
const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const faculties = await Faculty.find();
        res.status(OK).send(faculties);
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', [param('id').exists()], async (req, res, next) => {
    try {
        validationResult(req).throw();
        const {id} = req.params;
        const isValidId = mongoose.isValidObjectId(id);
        let faculty;

        if (isValidId) {
            faculty = await Faculty.findById(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send(faculty);
    } catch (err) {
        return next(err);
    }
});

router.post('/', [
    body('name').exists().withMessage('name is required'),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const facultyData = req.body;
        const newFaculty = await Faculty.create(facultyData);
        res.status(OK).send(newFaculty);
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', [
    body('name').optional(),
    param('id').exists(),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const {id} = req.params;
        const updateData = req.body;
        const isValidId = mongoose.isValidObjectId(id);
        let updatedFaculty;

        if (isValidId) {
            await Faculty.findByIdAndUpdate({_id: id}, updateData, {new: true}, (err, data) => {
                if (!err) updatedFaculty = data;
            });
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }
        res.status(OK).send(updatedFaculty);
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', [
    param('id').exists(),
], async (req, res, next) => {
    try {
        const {id} = req.params;
        const isValidId = mongoose.isValidObjectId(id);

        if (isValidId) {
            await Faculty.findByIdAndDelete(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send({id});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;