/**
 * Script Name : appSchemas.js
 * Description : Schemas matching to API data blueprints
 * Usage       : node appSchemas.js
 * Author      : @tonybnya
 */

const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const JobSchema = z.object({
  company: z.string().min(1),
  url: z.string().url(),
  position: z.string().min(1),
  location: z.string().min(1),
  jobType: z.enum(['on-site', 'remote', 'hybrid', 'internship', 'contract, 'part-time']),
  appliedData: z.string().datetime().optional().transform(val => val ? new Date(val) : new Date()),
  status: z.enum(['applied', 'phone-screen', 'interviewed', 'offer', 'rejected', 'ghosted']),
  hiringPerson: z.string().optional().nullable(),
  notes. z.string().optional().nullable()
});

module.exports = { registerSchema, loginSchema, jobSchema };
