const DIRegistry = require('../lib/diRegistry');
// TODO: use services instead of models...
// const { contractService } = DIRegistry.services;
const { Contract, Job, Profile } = DIRegistry.models;
const Op = DIRegistry.sequelize.Op;
const sequelizeInstance = DIRegistry.sequelizeInstance;
const logger = DIRegistry.logger;

const { PROFILE_TYPES, CONTRACT_STATUSES } = require('../lib/constants');

exports.getUnpaidJobs = async (req, res) => {
  const profile = req.profile;

  // TODO: create common function in services Facade
  const profileType = profile.type ===
                      PROFILE_TYPES.client ? 'ClientId' : 'ContractorId';

  let where = {
    status: {
      [Op.in]: [CONTRACT_STATUSES.in_progress, CONTRACT_STATUSES.new],
    },
    [profileType]: profile.id,
  };

  const contracts = await Contract.findAll({ where });

  const jobs = await Job.findAll({
    where: {
      paid: { [Op.not]: true },
      ContractId: { [Op.in]: contracts.map(contract => contract.id) },
    },
  });
  return res.json({ jobs: jobs });
};

exports.payForJob = async (req, res) => {
  const profile = req.profile;
  // TODO: we can use Joi for validation of input data here
  const { job_id: jobId } = req.params;
  const { amount } = req.body;

  const job = await Job.findOne({ where: { id: jobId } });
  if (!job) {
    return res.status(400).json({
      errors: [{
        message: 'Job was not found',
        code: 'NOT_FOUND',
      }],
    });
  }

  if (profile.type !== PROFILE_TYPES.client) {
    return res.status(404).end('Only clients can pay for the jobs!');
  }
  if (profile.balance < amount) {
    return res.status(400).json({
      errors: [{
        message: `Insufficient funds to pay for a job: ${jobId}`,
        code: 'INSUFFICIENT_FUNDS',
      }],
    });
  }

  let t = await sequelizeInstance.transaction();

  try {
    await Promise.all([
      Profile.update({ balance: profile.balance - amount },
          { where: { id: profile.id }, transaction: t }),
      Profile.update({ balance: profile.balance + amount },
          { where: { id: job.ContractId }, transaction: t }),
      Job.update({ paid: true, paymentDate: Date.now() },
          { where: { id: jobId }, transaction: t }),
    ]);

    await t.commit();
    logger.debug('Job pay succeed!');
  } catch (err) {
    logger.error(`Job pay failed! Rollback. Error: ${err.message}`);
    await t.rollback();
    throw err;
  }

  return res.sendStatus(204);
};
