const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDocs = {
    mobileSpec: {
        openapi: '3.0.0',
        info: {
            title: 'UserPool Mobile API Development',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express.',
            contact: {
                name: 'Sunil Kumar',
                email: 'sunil@day1tech.com',
            },
        },
        persistAuthorization: true,
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        servers: [
            {
                url: process.env.BACKEND_URL + '/api/v1',
                description: 'Development server',
            }
        ],
    },
    webSpec: {
        openapi: '3.0.0',
        info: {
            title: 'User Pool API Development',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
            contact: {
                name: 'Sunil Kumar',
                url: 'sunil@day1tech.com',
            },
        },
        basePath: '/api/v1',
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        servers: [
            {
                url: process.env.BACKEND_URL + '/api/v1',
                description: 'Development server',
            },
        ],
    },

};
const mobileOptions = {
    swaggerDefinition: swaggerDocs.mobileSpec,
    apis: ['api_docs/v1/mobile/*.yaml'],
};
const webOptions = {
    swaggerDefinition: swaggerDocs.webSpec,
    apis: ['api_docs/v1/web/*.yaml'],
};
module.exports.webSetup = swaggerJSDoc(webOptions);
