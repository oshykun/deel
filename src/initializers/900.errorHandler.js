const DIRegistry = require('../lib/diRegistry');
const logger = DIRegistry.logger;

module.exports = app => {
  app.use((err, req, res, next) => {
        logger.debug('ErrorHandler - handleError');

        let requestData = {
          method: req.method,
          headers: req.headers,
          originalUrl: req.originalUrl,
          body: JSON.stringify(req.body),
        };

        let errorResponse = getErrorResponse(err, req);
        if (!(err instanceof Error)) {
          err = new Error(JSON.stringify(err));
        }
        logger.error(`Error: ${err.stack} \n ${JSON.stringify(requestData, null, 2)}`);
        return res.status(errorResponse.httpCode).json(errorResponse.resBody);
      },
  );
};

const getErrorResponse = err => {
  // TODO: add new custom Error
  return {
    resBody: {
      message: err.message || 'Internal ERROR!',
      code: 'INTERNAL_ERROR',
    },
    httpCode: 500,
  };
};
