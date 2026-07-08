/**
 * Script Name : jobController.js
 * Description : Define controller layer for Job Application resources
 * Usage       : node jobController.js
 * Author      : @tonybnya
 */

const prisma = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');

exports.createJob = async (req, res) => {
  try {
    const job = await prisma.job.create({
      data: { ...req.validatedBody, userId: req.user.id }
    });
    sendSuccess(res, 201, job);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

exports.getJobs = async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id },
    orderBy: { appliedDate: 'desc' }
  });
  sendSuccess(res, 200, jobs);
};

exports.getJobById = async (req, res) => {
  const job = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!job) return sendError(res, 404, 'Job entry not found or unauthorized');
  sendSuccess(res, 200, job);
};

exports.updateJob = async(req, res) => {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!job) return sendError(res, 404, 'Job entry not found or unauthorized');

    const updatedJob = await prisma.job.update({
      where: { id: req.params.id },
      data: req.validatedBody
    });
    sendSuccess(res, 200, updatedJob);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await prisma.job.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!job) return sendError(res, 404, 'Job entry not found or unauthorized');

    await prisma.job.delete({ where: { id: req.params.id } });
    sendSuccess(res, 200, { message: 'Job history entry removed successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
};
