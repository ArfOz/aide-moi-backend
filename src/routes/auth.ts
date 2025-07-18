import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';
import { AppDataSource } from '../config/database';
import { authenticateToken } from '../middleware/auth';

interface LoginBody {
  email: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
}

// Define the authenticated request type properly
interface AuthenticatedRouteRequest extends FastifyRequest {
  user: {
    userId: number;
    email: string;
    username: string;
  };
}

async function authRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
) {
  const userService = new UserService(AppDataSource);

  // Login endpoint
  fastify.post<{ Body: LoginBody }>(
    '/login',
    {
      schema: {
        tags: ['auth'],
        summary: 'User login',
        description: 'Authenticate user and return JWT tokens',
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              tokens: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  refreshToken: { type: 'string' },
                  expiresIn: { type: 'string' },
                  expiresAt: { type: 'string', format: 'date-time' },
                  refreshExpiresIn: { type: 'string' },
                  refreshExpiresAt: { type: 'string', format: 'date-time' }
                }
              },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string' },
                  roles: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
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
      const { email, password } = request.body;

      try {
        // Authenticate user
        const user = await userService.authenticateUser(email, password);
        if (!user) {
          return reply.status(401).send({
            error: {
              message: 'Invalid email or password',
              statusCode: 401
            }
          });
        }

        // Generate JWT tokens
        const tokenPayload = {
          userId: user.id,
          email: user.email,
          username: user.username
        };

        const { accessToken, refreshToken } =
          JwtService.generateTokenPair(tokenPayload);

        // Calculate expiration times
        const accessTokenExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
        const refreshTokenExpiresIn =
          process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

        // Calculate exact expiration dates
        const now = new Date();
        const accessTokenExpiresAt = new Date(
          now.getTime() + parseExpirationTime(accessTokenExpiresIn)
        );
        const refreshTokenExpiresAt = new Date(
          now.getTime() + parseExpirationTime(refreshTokenExpiresIn)
        );

        // Log successful login
        fastify.log.info(`User logged in: ${user.username}`);

        return reply.status(200).send({
          message: 'Login successful',
          tokens: {
            token: accessToken,
            refreshToken: refreshToken,
            expiresIn: accessTokenExpiresIn,
            expiresAt: accessTokenExpiresAt.toISOString(),
            refreshExpiresIn: refreshTokenExpiresIn,
            refreshExpiresAt: refreshTokenExpiresAt.toISOString()
          },
          user: {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            roles: ['user'] // Default role, you can expand this based on your user model
          }
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: {
            message: 'Login failed',
            statusCode: 500
          }
        });
      }
    }
  );

  // Refresh token endpoint
  fastify.post<{ Body: RefreshTokenBody }>(
    '/refresh',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh access token',
        description: 'Generate new access token using refresh token',
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              expiresIn: { type: 'string' }
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
      request: FastifyRequest<{ Body: RefreshTokenBody }>,
      reply: FastifyReply
    ) => {
      const { refreshToken } = request.body;

      try {
        const decoded = JwtService.verifyToken(refreshToken);
        if (!decoded) {
          return reply.status(401).send({
            error: {
              message: 'Invalid refresh token',
              statusCode: 401
            }
          });
        }

        // Generate new access token
        const tokenPayload = {
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username
        };

        const newAccessToken = JwtService.generateAccessToken(tokenPayload);

        return reply.status(200).send({
          accessToken: newAccessToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: {
            message: 'Token refresh failed',
            statusCode: 500
          }
        });
      }
    }
  );

  // Get current user profile (protected route)
  fastify.get(
    '/profile',
    {
      preHandler: authenticateToken,
      schema: {
        tags: ['auth'],
        summary: 'Get current user profile',
        description: 'Get authenticated user information',
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  username: { type: 'string' },
                  email: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      } as any
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Type assertion after authentication middleware
        const authRequest = request as AuthenticatedRouteRequest;

        const user = await userService.findById(authRequest.user.userId);
        if (!user) {
          return reply.status(404).send({
            error: {
              message: 'User not found',
              statusCode: 404
            }
          });
        }

        return reply.status(200).send({ user });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: {
            message: 'Failed to get user profile',
            statusCode: 500
          }
        });
      }
    }
  );

  // Logout endpoint (optional - for token blacklisting)
  fastify.post(
    '/logout',
    {
      preHandler: authenticateToken,
      schema: {
        tags: ['auth'],
        summary: 'User logout',
        description: 'Invalidate current token',
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      } as any
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // In a real application, you would add the token to a blacklist
      // For now, we'll just return a success message
      return reply.status(200).send({
        message: 'Logged out successfully'
      });
    }
  );
}

// Helper function to parse expiration time strings
function parseExpirationTime(expiresIn: string): number {
  const timeUnit = expiresIn.slice(-1);
  const timeValue = parseInt(expiresIn.slice(0, -1));

  switch (timeUnit) {
    case 's':
      return timeValue * 1000; // seconds
    case 'm':
      return timeValue * 60 * 1000; // minutes
    case 'h':
      return timeValue * 60 * 60 * 1000; // hours
    case 'd':
      return timeValue * 24 * 60 * 60 * 1000; // days
    default:
      return 24 * 60 * 60 * 1000; // default to 24 hours
  }
}

export default authRoutes;
