const router = require('express-promise-router')();

const { getProfile } = require('../middleware/getProfile');

const { getUnpaidJobs, payForJob } = require('../controllers/jobs');

const BASE_PATH = '/jobs';

module.exports = () => {

  router.route('/unpaid').get(getProfile, getUnpaidJobs);
  router.route('/:job_id/pay').post(getProfile, payForJob);

  return { router, basePath: BASE_PATH };
};
