const build = require('../src/app');

describe('Health Routes', () => {
  let app;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /health should return health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty('status', 'ok');
    expect(payload).toHaveProperty('timestamp');
    expect(payload).toHaveProperty('uptime');
    expect(payload).toHaveProperty('environment');
  });

  test('GET /health/detailed should return detailed health info', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health/detailed'
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty('status', 'ok');
    expect(payload).toHaveProperty('memory');
    expect(payload).toHaveProperty('cpu');
  });
});
