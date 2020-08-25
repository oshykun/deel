const expressRouter = require('express-promise-router')();

const routeFunctions = require('../routes')();

module.exports = app => {
  routeFunctions.map(routeFn => routeFn()).
      forEach(({ router, basePath }) => expressRouter.use(basePath, router));

  app.use('/', expressRouter); // Set the default version to latest.
};
