import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

interface Company {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

// In-memory store for demo purposes
const companies: Record<string, Company> = {};

async function companyRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  // List all companies
  fastify.get('/', async (_, reply: FastifyReply) => {
    return reply.status(200).send(Object.values(companies));
  });

  // Get company by ID
  fastify.get(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const company = companies[id];
      if (!company) {
        return reply.status(404).send({ message: 'Company not found' });
      }
      return reply.status(200).send(company);
    }
  );

  // Create a new company
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: Omit<Company, 'id'> }>, reply) => {
      const id = uuidv4();
      const newCompany: Company = { id, ...request.body };
      companies[id] = newCompany;
      return reply.status(201).send(newCompany);
    }
  );

  // Update an existing company
  fastify.put(
    '/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' }
          }
        }
      }
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<Omit<Company, 'id'>>;
      }>,
      reply
    ) => {
      const { id } = request.params;
      const company = companies[id];
      if (!company) {
        return reply.status(404).send({ message: 'Company not found' });
      }
      const updated = { ...company, ...request.body };
      companies[id] = updated;
      return reply.status(200).send(updated);
    }
  );

  // Delete a company
  fastify.delete(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      if (!companies[id]) {
        return reply.status(404).send({ message: 'Company not found' });
      }
      delete companies[id];
      return reply.status(204).send();
    }
  );
}
export default companyRoutes;
