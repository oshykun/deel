const router = require('express-promise-router')();

const { getBestClients, getBestProfession } = require('../controllers/admin');

const BASE_PATH = '/admin';

module.exports = () => {

  // TODO: add admin role validation...
  router.route('/best-clients').get(getBestClients);
  router.route('/best-profession').get(getBestProfession);

  return { router, basePath: BASE_PATH };
};
