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
  try {
    const { status, sort, page, limit } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const orderBy = sort === 'date'
      ? { appliedDate: 'asc' }
      : { appliedDate: 'desc' };

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          orderBy,
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
        }),
        prisma.job.count({ where }),
      ]);

      return sendSuccess(res, 200, {
        jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    const jobs = await prisma.job.findMany({ where, orderBy });
    sendSuccess(res, 200, jobs);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await prisma.job.groupBy({
      by: ['status'],
      where: { userId: req.user.id },
      _count: { status: true },
    });

    const result = stats.map((s) => ({
      status: s.status,
      count: s._count.status,
    }));

    sendSuccess(res, 200, result);
  } catch (error) {
    sendError(res, 500, error.message);
  }
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
