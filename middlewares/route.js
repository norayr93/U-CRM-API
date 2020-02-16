const studentsRoutes = require('../controllers/students');
const groupsRoutes = require('../controllers/groups');
const facultiesRoutes = require('../controllers/faculties');
const authRoutes = require('../controllers/auth');

const {NotFoundError} = require('../helpers/error');

const init = app => {
    app.use('/students', studentsRoutes);
    app.use('/groups', groupsRoutes);
    app.use('/faculties', facultiesRoutes);
    app.use('/auth', authRoutes);

    app.use((req, res, next) => {
        return next(new NotFoundError(`No handler is found for route "${req.url}"`));
    });

};

module.exports = init;
