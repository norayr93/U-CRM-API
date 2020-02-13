const compression = require('compression');
const helmet = require('helmet');

const init = app => {
    app.use(compression());
    app.use(helmet());
};

module.exports = init;