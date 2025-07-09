import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify';
import { UserService } from '../services/UserService';

interface CreateUserBody {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UserParams {
  id: string;
}

async function userRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  // Initialize UserService with database connection
  const userService = new UserService((fastify as any).db);

  // User schema definitions
  const userSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      username: { type: 'string' },
      email: { type: 'string', format: 'email' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  };

  const createUserSchema = {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      username: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  };

  const updateUserSchema = {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  };

  // Get all users
  fastify.get(
    '/',
    {
      schema: {
        tags: ['users'],
        summary: 'Get all users',
        description: 'Retrieve a list of all users',
        response: {
          200: {
            type: 'array',
            items: userSchema
          }
        }
      } as any
    },
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      return await userService.findAll();
    }
  );

  // Get user by ID
  fastify.get<{ Params: UserParams }>(
    '/:id',
    {
      schema: {
        tags: ['users'],
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          },
          required: ['id']
        },
        response: {
          200: userSchema,
          404: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  statusCode: { type: 'integer' }
                }
              }
            }
          }
        }
      } as any
    },
    async (
      request: FastifyRequest<{ Params: UserParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const user = await userService.findById(parseInt(id));

      if (!user) {
        reply.status(404).send({
          error: {
            message: 'User not found',
            statusCode: 404
          }
        });
        return;
      }

      return user;
    }
  );

  // Create a new user
  fastify.post<{ Body: CreateUserBody }>(
    '/',
    {
      schema: {
        tags: ['users'],
        summary: 'Create a new user',
        description: 'Create a new user with name and email',
        body: createUserSchema,
        response: {
          201: userSchema,
          400: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  statusCode: { type: 'integer' }
                }
              }
            }
          }
        }
      } as any
    },
    async (
      request: FastifyRequest<{ Body: CreateUserBody }>,
      reply: FastifyReply
    ) => {
      const { username, email, password } = request.body;

      try {
        // Check if email already exists
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
          reply.status(400).send({
            error: {
              message: 'User with this email already exists',
              statusCode: 400
            }
          });
          return;
        }

        const newUser = await userService.create({ username, email, password });
        reply.status(201).send(newUser);
      } catch (error) {
        fastify.log.error(error);
        reply.status(400).send({
          error: {
            message: 'Failed to create user',
            statusCode: 400
          }
        });
      }
    }
  );

  // Update a user
  fastify.put<{ Params: UserParams; Body: CreateUserBody }>(
    '/:id',
    {
      schema: {
        tags: ['users'],
        summary: 'Update a user',
        description: 'Update an existing user',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          },
          required: ['id']
        },
        body: updateUserSchema,
        response: {
          200: userSchema,
          404: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  statusCode: { type: 'integer' }
                }
              }
            }
          }
        }
      } as any
    },
    async (
      request: FastifyRequest<{ Params: UserParams; Body: CreateUserBody }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const { username, email } = request.body;

      try {
        // Check if user exists
        const existingUser = await userService.findById(parseInt(id));
        if (!existingUser) {
          reply.status(404).send({
            error: {
              message: 'User not found',
              statusCode: 404
            }
          });
          return;
        }

        // Check if email already exists (excluding current user)
        const emailUser = await userService.findByEmail(email);
        if (emailUser && emailUser.id !== parseInt(id)) {
          reply.status(400).send({
            error: {
              message: 'User with this email already exists',
              statusCode: 400
            }
          });
          return;
        }

        const updatedUser = await userService.update(parseInt(id), {
          username,
          email
        });
        return updatedUser;
      } catch (error) {
        fastify.log.error(error);
        reply.status(400).send({
          error: {
            message: 'Failed to update user',
            statusCode: 400
          }
        });
      }
    }
  );

  // Delete a user
  fastify.delete<{ Params: UserParams }>(
    '/:id',
    {
      schema: {
        tags: ['users'],
        summary: 'Delete a user',
        description: 'Delete an existing user',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          },
          required: ['id']
        },
        response: {
          204: {},
          404: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  statusCode: { type: 'integer' }
                }
              }
            }
          }
        }
      } as any
    },
    async (
      request: FastifyRequest<{ Params: UserParams }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      try {
        const deleted = await userService.delete(parseInt(id));

        if (!deleted) {
          reply.status(404).send({
            error: {
              message: 'User not found',
              statusCode: 404
            }
          });
          return;
        }

        reply.status(204).send();
      } catch (error) {
        fastify.log.error(error);
        reply.status(400).send({
          error: {
            message: 'Failed to delete user',
            statusCode: 400
          }
        });
      }
    }
  );

  // User login/authentication
  fastify.post<{ Body: LoginBody }>(
    '/login',
    {
      schema: {
        tags: ['users'],
        summary: 'User login',
        description: 'Authenticate user with email and password',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 1 }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: userSchema,
              message: { type: 'string' }
            }
          },
          401: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  statusCode: { type: 'integer' }
                }
              }
            }
          }
        }
      } as any
    },
    async (
      request: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { email, password } = request.body;

        const user = await userService.authenticateUser(email, password);

        if (!user) {
          return reply.status(401).send({
            error: {
              message: 'Invalid email or password',
              statusCode: 401
            }
          });
        }

        return reply.status(200).send({
          user,
          message: 'Login successful'
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: {
            message: error.message || 'Login failed',
            statusCode: 500
          }
        });
      }
    }
  );
}

export default userRoutes;
