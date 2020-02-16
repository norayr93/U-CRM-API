const {Router} = require('express');
const {get} = require('lodash');
const {OK} = require('http-status-codes');
const {BadRequestError} = require('../helpers/error');
const {body, param, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Student = mongoose.model('Student');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

// Routes
/**
 * @swagger
 * /students:
 *  get:
 *    tags: [Students]
 *    description: get all students
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Student'
 */
router.get('/', async (req, res, next) => {
    try {
        const query = req.query || {};
        let queryObject = {};
        const keysForRegex = ['name', 'lastname', 'email', 'phone'];

        for (const key in query) {
            if (query[key] && keysForRegex.includes(key)) {
                queryObject[key] = {'$regex': get(query, key, ''), '$options': 'i'};
            } else if (query[key] && !keysForRegex.includes(key)) {
                queryObject[key] = get(query, key, '');
            }
        }

        const students = await Student.find(queryObject);
        res.status(OK).send(students);
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', [param('id').exists()], async (req, res, next) => {
    try {
        validationResult(req).throw();
        const {id} = req.params;
        const isValidId = mongoose.isValidObjectId(id);
        let student;

        if (isValidId) {
            student = await Student.findById(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send(student);
    } catch (err) {
        return next(err);
    }
});

/**
 * @swagger
 *  /students:
 *    post:
 *      summary: Create a new student
 *      tags: [Students]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Student'
 *      responses:
 *        "200":
 *          description: A student schema
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Student'
 */
router.post('/', [
    body('name').exists().withMessage('name is required'),
    body('lastname').exists().withMessage('lastname is required'),
    body('email').exists().withMessage('email is required').isEmail().withMessage('invalid email'),
    body('phone').exists().withMessage('phone number must contain only numbers').isNumeric(),
    body('faculty').exists().withMessage('faculty is required'),
    body('group').exists().withMessage('group is required'),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const studentData = req.body;
        const newStudent = await Student.create(studentData);
        res.status(OK).send(newStudent);
    } catch (err) {
        return next(err);
    }
});

router.put('/:id', [
    body('name').optional(),
    body('lastname').optional(),
    body('email').optional().isEmail().withMessage('invalid email'),
    body('phone').optional().isNumeric().withMessage('phone number must contain only numbers'),
    body('faculty').optional(),
    body('group').optional(),
    param('id').exists(),
], async (req, res, next) => {
    try {
        validationResult(req).throw();

        const {id} = req.params;
        const updateData = req.body;
        const isValidId = mongoose.isValidObjectId(id);
        let updatedStudent;

        if (isValidId) {
            await Student.findByIdAndUpdate({_id: id}, updateData, {new: true}, (err, data) => {
                if (!err) updatedStudent = data;
            });
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }
        res.status(OK).send(updatedStudent);
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
            await Student.findByIdAndDelete(id);
        } else {
            throw new BadRequestError('Invalid ObjectId', true);
        }

        res.status(OK).send({id});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;

