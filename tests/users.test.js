const build = require('../src/app');

describe('User Routes with TypeORM', () => {
  let app;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /api/v1/users should return list of users', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users'
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(Array.isArray(payload)).toBe(true);
  });

  test('POST /api/v1/users should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com` // Unique email
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: newUser
    });

    expect(response.statusCode).toBe(201);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty('id');
    expect(payload.name).toBe(newUser.name);
    expect(payload.email).toBe(newUser.email);
    expect(payload).toHaveProperty('createdAt');
    expect(payload).toHaveProperty('updatedAt');
  });

  test('GET /api/v1/users/:id should return 404 for non-existent user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/999999'
    });

    expect(response.statusCode).toBe(404);
  });

  test('POST /api/v1/users should return 400 for duplicate email', async () => {
    const user = {
      name: 'Duplicate User',
      email: `duplicate-${Date.now()}@example.com`
    };

    // Create first user
    await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: user
    });

    // Try to create second user with same email
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: user
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload.error.message).toContain('email already exists');
  });
});
