const validator = require('validator');

const Student = mongoose => {
    const StudentSchema = mongoose.Schema({
        name: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        lastname: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        email: {
            required: true,
            unique: true,
            trim: true,
            type: String,
            validate: value => validator.isEmail(value),
        },
        phone: {
            required: true,
            trim: true,
            type: String,
            validate: value => validator.isInt(value),
        },
        faculty: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        group: {
            required: true,
            trim: true,
            type: String,
            minLength: 1,
        },
        studentId: mongoose.Types.ObjectId,
    });

    return mongoose.model('Student', StudentSchema);
};

module.exports = Student;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Student:
 *        type: object
 *        required:
 *          - name
 *          - lastname
 *          - email
 *          - phone
 *          - faculty
 *          - group
 *        properties:
 *          name:
 *            type: string
 *          lastname:
 *            type: string
 *          faculty:
 *            type: string
 *          group:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          phone:
 *            type: integer
 *            format: int64
 */
