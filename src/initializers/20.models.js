const DIRegistry = require('../lib/diRegistry');
const models = require('../models');

let sequelize = DIRegistry.sequelizeInstance;

// add models relations
models.forEach(model => {
  if (Object.prototype.hasOwnProperty.call(model, 'associate')) {
    model.associate(sequelize.models);
  }
});

DIRegistry.addModels(sequelize.models);

// no need to export anything, this script will be run in index.js on `require`
