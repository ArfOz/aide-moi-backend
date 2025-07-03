const fp = require('fastify-plugin');

async function swaggerPlugin(fastify, options) {
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Aide Moi Backend API',
        description: 'API documentation for Aide Moi Backend',
        version: '1.0.0'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'users', description: 'User related endpoints' }
      ]
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
}

module.exports = fp(swaggerPlugin);
