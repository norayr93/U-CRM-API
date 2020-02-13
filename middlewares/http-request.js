const bodyParser = require('body-parser');

const init = app => {
    app.use(bodyParser.json({limit: '5mb'}));
};

module.exports = init;