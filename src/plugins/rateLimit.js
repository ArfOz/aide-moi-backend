const fp = require('fastify-plugin');

async function rateLimitPlugin(fastify, options) {
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100, // Maximum 100 requests
    timeWindow: '1 minute', // Per minute
    errorResponseBuilder: function (request, context) {
      return {
        error: {
          message: 'Rate limit exceeded, retry in 1 minute',
          statusCode: 429,
          retryAfter: Math.round(context.ttl / 1000)
        }
      };
    }
  });
}

module.exports = fp(rateLimitPlugin);
