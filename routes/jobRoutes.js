/**
 * Script Name : jobRoutes.js
 * Description : Routes layer for job application resources
 * Usage       : node jobRoutes.js
 * Author      : @tonybnya
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const validateBody =  require('../middleware/validateMiddleware');
const { jobSchema } = require('../validators/appSchemas');
const { authenticateToken } = require('../middleware/authMiddleware');

// apply authentication middleware to all endpoints in this router file
router.use(authenticateToken);

router.post('/', validateBody(jobSchema), jobController.createJob);
router.get('/stats', jobController.getStats);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id', validateBody(jobSchema), jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
