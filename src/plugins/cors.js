const fp = require('fastify-plugin');

async function corsPlugin(fastify, options) {
  await fastify.register(require('@fastify/cors'), {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com'] // Add your production domains
        : true, // Allow all origins in development
    credentials: true
  });
}

module.exports = fp(corsPlugin);
