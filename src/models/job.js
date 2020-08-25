const DIRegistry = require('../lib/diRegistry');

let sequelize = DIRegistry.sequelizeInstance;
let Sequelize = DIRegistry.sequelize;

class Job extends Sequelize.Model {
}

Job.init(
    {
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Job',
    },
);

/**
 * Relations
 */
Job.associate = models => {
  Job.belongsTo(models.Contract);
};

module.exports = Job;
