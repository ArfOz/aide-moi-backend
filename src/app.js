const fastify = require('fastify');

/**
 * Create and configure Fastify instance
 * @param {Object} opts - Fastify options
 * @returns {Object} Fastify instance
 */
function build(opts = {}) {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true
          }
        }
      })
    },
    ...opts
  });

  // Register plugins
  app.register(require('./plugins/database'));
  app.register(require('./plugins/cors'));
  app.register(require('./plugins/helmet'));
  app.register(require('./plugins/rateLimit'));
  app.register(require('./plugins/swagger'));

  // Register routes
  app.register(require('./routes/health'), { prefix: '/health' });
  app.register(require('./routes/api'), { prefix: '/api/v1' });

  // Global error handler
  app.setErrorHandler(async (error, request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    reply.status(statusCode).send({
      error: {
        message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  });

  // 404 handler
  app.setNotFoundHandler(async (request, reply) => {
    reply.status(404).send({
      error: {
        message: 'Route not found',
        statusCode: 404,
        path: request.url
      }
    });
  });

  return app;
}

module.exports = build;
