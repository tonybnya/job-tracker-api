/**
 * Script Name : swagger.js
 * Description : Swagger/OpenAPI configuration
 * Usage       : const swaggerSetup = require('../config/swagger');
 * Author      : @tonybnya
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Tracker API',
      version: '1.0.0',
      description: 'REST API for tracking job applications',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alice@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        JobInput: {
          type: 'object',
          required: ['company', 'url', 'position', 'location', 'jobType', 'status'],
          properties: {
            company: { type: 'string', example: 'Stripe' },
            url: { type: 'string', format: 'uri', example: 'https://stripe.com/jobs' },
            position: { type: 'string', example: 'Backend Engineer' },
            location: { type: 'string', example: 'Remote - US' },
            jobType: { type: 'string', enum: ['on-site', 'remote', 'hybrid', 'internship', 'contract', 'part-time'], example: 'remote' },
            status: { type: 'string', enum: ['applied', 'phone-screen', 'interviewed', 'offer', 'rejected', 'ghosted'], example: 'applied' },
            hiringPerson: { type: 'string', nullable: true, example: 'Sarah Chen' },
            notes: { type: 'string', nullable: true, example: 'Referred by a friend' },
            appliedDate: { type: 'string', format: 'date-time', description: 'Defaults to now if omitted' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            company: { type: 'string' },
            url: { type: 'string' },
            position: { type: 'string' },
            location: { type: 'string' },
            jobType: { type: 'string' },
            appliedDate: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
            hiringPerson: { type: 'string', nullable: true },
            notes: { type: 'string', nullable: true },
            userId: { type: 'string', format: 'uuid' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
        StatsItem: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'applied' },
            count: { type: 'integer', example: 5 },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
