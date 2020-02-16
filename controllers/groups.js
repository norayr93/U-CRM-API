const {Router} = require('express');
const {OK} = require('http-status-codes');
const {BadRequestError} = require('../helpers/error');
const {body, param, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Group = mongoose.model('Group');
const router = Router();

// Routes
/**
 * @swagger
 * /groups:
 *  get:
 *    tags: [Students]
 *    description: get all students
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', async (req, res, next) => {
    try {
        const groups = await Group.find();
        res.status(OK).send(groups);
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', [param('id').exists()], async (req, res, next) => {
    try {
        validationResult(req).throw();
        const {id} = req.params;
        const isValidId = mongoose.isValidObjectId(id);
        let group;

        if (isValidId) {
            group = await Group.findById(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send(group);
    } catch (err) {
        return next(err);
    }
});

router.post('/', [
    body('name').exists().withMessage('name is required'),
    body('faculty').exists().withMessage('faculty is required'),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const groupData = req.body;
        const newGroup = await Group.create(groupData);
        res.status(OK).send(newGroup);
    } catch (err) {
        console.log(err, 'err');
        return next(err);
    }
});

router.put('/:id', [
    body('name').optional(),
    body('group').optional(),
    param('id').exists(),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const {id} = req.params;
        const updateData = req.body;
        const isValidId = mongoose.isValidObjectId(id);
        let updatedGroup;

        if (isValidId) {
            await Group.findByIdAndUpdate({_id: id}, updateData, {new: true}, (err, data) => {
                if (!err) updatedGroup = data;
            });
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }
        res.status(OK).send(updatedGroup);
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
            await Group.findByIdAndDelete(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send({id});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;