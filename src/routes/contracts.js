const router = require('express-promise-router')();

const { getProfile } = require('../middleware/getProfile');

const { getContractById, getContracts } = require('../controllers/contracts');

const BASE_PATH = '/contracts';

module.exports = () => {

  router.route('/:id(\\d+)').get(getProfile, getContractById);
  router.route('/').get(getProfile, getContracts);

  return { router, basePath: BASE_PATH };
};
