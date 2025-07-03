require('dotenv').config();
require('reflect-metadata');
const build = require('./app');

const start = async () => {
  const app = build();

  try {
    const host = process.env.HOST || '0.0.0.0';
    const port = process.env.PORT || 3000;

    await app.listen({ port: parseInt(port), host });
    app.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('\nReceived SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('\nReceived SIGTERM. Graceful shutdown...');
  process.exit(0);
});

start();
