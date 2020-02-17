const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    info: {
        title: 'REST API for University CRM',
        version: '3.0.0',
        openapi: '3.0.1',
        description: 'University CRM API information',
        servers: ['http://localhost:5000'],
    },
};

  const options = {
    swaggerDefinition,
    apis: ['./controllers/**/*.js', './openapi/**/*.yml'],
};

const swaggerDocs = swaggerJsDoc(options);

const init = app => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = init;