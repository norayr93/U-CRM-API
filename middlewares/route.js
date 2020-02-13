const studentsRoutes = require('../controllers/students');

const {NotFoundError} = require('../helpers/error');

const init = app => {
    app.use('/students', studentsRoutes);

    app.use((req, res, next) => {
        return next(new NotFoundError(`No handler is found for route "${req.url}"`));
    });

};

module.exports = init;
