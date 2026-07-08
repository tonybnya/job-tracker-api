/**
 * Script Name : jobController.js
 * Description : Define controller layer for Job Application resources
 * Usage       : node jobController.js
 * Author      : @tonybnya
 */

const prisma = require('../config/prisma');

exports.createJob = async (req, res) => {
  try {
    const job = await prisma.job.create({
      data: { ...req.validatedBody, userId: req.user.id }
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id },
    orderBy: { appliedDate: 'desc' }
  });
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  const job = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!job) return res.status(404).json({ error: 'Job entry not found or unauthorized' });
  res.json(job);
};

exports.updateJob = async(req, res) => {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!job) return res.status(404).json({ error: 'Job entry not found or unauthorized' });

  const updatedJob = await prisma.job.update({
      where: { id: req.params.id },
      data: req.validatedBody
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!job) return res.status(404).json({ error: 'Job entry not found or unauthorized' });

  await prisma.job.delete({ where: { id: req.params.id} });
  res.json({ message: 'Job history entry removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
