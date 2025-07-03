const fp = require('fastify-plugin');
const AppDataSource = require('../config/database');

async function databasePlugin(fastify, _options) {
  try {
    // Initialize TypeORM DataSource
    await AppDataSource.initialize();
    fastify.log.info('Database connection established successfully');

    // Make DataSource available throughout the app
    fastify.decorate('db', AppDataSource);

    // Graceful shutdown
    fastify.addHook('onClose', async (instance, done) => {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        instance.log.info('Database connection closed');
      }
      done();
    });
  } catch (error) {
    fastify.log.error('Error connecting to database:', error);
    throw error;
  }
}

module.exports = fp(databasePlugin);
