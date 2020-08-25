const Sequelize = require('sequelize');

const DIRegistry = require('../lib/diRegistry');
const { dbConfig } = require('../../config');

const sequelize = new Sequelize(dbConfig);

DIRegistry.addSequelizeInstance(sequelize);
DIRegistry.addSequelize(Sequelize);

// no need to export anything, this script will be run in index.js on `require`
