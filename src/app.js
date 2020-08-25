const express = require('express');
const http = require('http');

// TODO: create proper logger
const logger = console;
const DIRegistry = require('./lib/diRegistry');
const runInitializers = require('./initializers');

module.exports = {
  initApp() {
    DIRegistry.addLogger(logger);
    const app = express();
    runInitializers(app);
    return app;
  },

  async start(app) {
    const port = process.env.PORT || '3001';
    const server = http.createServer(app);

    try {
      server.listen(port,
          () => logger.log(`Express App Listening on Port ${port}`));
    } catch (error) {
      logger.error(`An error occurred: ${JSON.stringify(error)}`);
      process.exit(1);
    }
  },
};
