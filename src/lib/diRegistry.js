const store = {};

/**
 * This is simple dependency injection container.
 * @module diRegistry
 */

module.exports = {
  addModels(models) {
    store.models = models;
  },

  addServices(services) {
    store.services = services;
  },

  addSequelize(sequelize) {
    store.sequelize = sequelize;
  },

  addSequelizeInstance(sequelizeInstance) {
    store.sequelizeInstance = sequelizeInstance;
  },

  addLogger(logger) {
    store.logger = logger;
  },

  get models() {
    return store.models;
  },

  get sequelize() {
    return store.sequelize;
  },

  get sequelizeInstance() {
    return store.sequelizeInstance;
  },

  get services() {
    return store.services;
  },

  get logger() {
    return store.logger;
  },
};
