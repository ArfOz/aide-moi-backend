async function apiRoutes(fastify, options) {
  // Register sub-routes
  fastify.register(require('./users'), { prefix: '/users' });

  // Root API endpoint
  fastify.get(
    '/',
    {
      schema: {
        tags: ['api'],
        summary: 'API root',
        description: 'Get API information',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              version: { type: 'string' },
              timestamp: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      return {
        message: 'Welcome to Aide Moi Backend API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      };
    }
  );
}

module.exports = apiRoutes;
