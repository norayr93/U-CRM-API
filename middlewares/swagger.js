const config = require('config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swagger = config.get('swagger');
const swaggerDocs = swaggerJsDoc(swagger);

console.log(JSON.stringify(swaggerDocs));

const init = app => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = init;