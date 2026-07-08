/**
 * Script Name : seed.js
 * Description : Seed the database with dummy users and job applications
 * Usage       : npx prisma db seed
 * Author      : @tonybnya
 */

const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const users = [
  { name: 'Alice Johnson',  email: 'alice@example.com' },
  { name: 'Bob Smith',      email: 'bob@example.com' },
  { name: 'Carol Davis',    email: 'carol@example.com' },
  { name: 'Dan Wilson',     email: 'dan@example.com' },
  { name: 'Eve Martin',     email: 'eve@example.com' },
  { name: 'Frank Lee',      email: 'frank@example.com' },
  { name: 'Grace Kim',      email: 'grace@example.com' },
  { name: 'Henry Brown',    email: 'henry@example.com' },
  { name: 'Ivy Chen',       email: 'ivy@example.com' },
  { name: 'Jack Taylor',    email: 'jack@example.com' },
];

const companies = [
  { company: 'Google',        url: 'https://careers.google.com' },
  { company: 'Stripe',        url: 'https://stripe.com/jobs' },
  { company: 'Notion',        url: 'https://notion.com/careers' },
  { company: 'Figma',         url: 'https://figma.com/careers' },
  { company: 'Vercel',        url: 'https://vercel.com/careers' },
  { company: 'Linear',        url: 'https://linear.app/jobs' },
  { company: 'Supabase',      url: 'https://supabase.com/careers' },
  { company: 'Railway',       url: 'https://railway.com/jobs' },
  { company: 'Netlify',       url: 'https://netlify.com/careers' },
  { company: 'PlanetScale',   url: 'https://planetscale.com/careers' },
  { company: 'GitHub',        url: 'https://github.com/about/careers' },
  { company: 'Datadog',       url: 'https://datadoghq.com/careers' },
  { company: 'Render',        url: 'https://render.com/careers' },
  { company: 'Fly.io',        url: 'https://fly.io/jobs' },
  { company: 'Cloudflare',    url: 'https://cloudflare.com/careers' },
];

const positions = [
  'Software Engineer',
  'Senior Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Staff Engineer',
  'Engineering Manager',
  'Site Reliability Engineer',
  'Data Engineer',
  'Platform Engineer',
  'iOS Developer',
  'Android Developer',
  'Machine Learning Engineer',
  'Product Engineer',
  'Infrastructure Engineer',
];

const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Remote - US',
  'Remote - Global',
  'Austin, TX',
  'Seattle, WA',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Chicago, IL',
  'Denver, CO',
  'Portland, OR',
  'Los Angeles, CA',
  'Boston, MA',
];

const jobTypes = ['on-site', 'remote', 'hybrid', 'internship', 'contract', 'part-time'];
const statuses = ['applied', 'phone-screen', 'interviewed', 'offer', 'rejected', 'ghosted'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

async function main() {
  console.log('Seeding database...');

  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const createdUsers = await Promise.all(
    users.map((u) =>
      prisma.user.create({
        data: { ...u, password: hashedPassword },
      })
    )
  );

  console.log(`Created ${createdUsers.length} users`);

  const jobs = [];
  for (let i = 0; i < 50; i++) {
    const company = randomItem(companies);
    jobs.push({
      company: company.company,
      url: company.url,
      position: randomItem(positions),
      location: randomItem(locations),
      jobType: randomItem(jobTypes),
      appliedDate: randomDate(90),
      status: randomItem(statuses),
      hiringPerson: Math.random() > 0.3 ? randomItem(users).name : null,
      notes: Math.random() > 0.5 ? `Followed up on ${randomDate(30).toLocaleDateString()}` : null,
      userId: randomItem(createdUsers).id,
    });
  }

  const createdJobs = await Promise.all(
    jobs.map((j) => prisma.job.create({ data: j }))
  );

  console.log(`Created ${createdJobs.length} jobs`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
