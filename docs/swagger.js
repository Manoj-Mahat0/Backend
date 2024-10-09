// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'FIT-ESPERO',
        version: '1.0.0',
        description: 'API DOCS',
    },
    servers: [
        {
            url: `https://fitespero.hemsidaavt.com/api/v1`,
            description: 'Development server',
        },
        {
            url: `http://localhost:${process.env.PORT || 8080}/api/v1`, 
            description: 'Local server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./controllers/*.js', './routers/*.js'], // Path to the API docs (adjust as needed)
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
