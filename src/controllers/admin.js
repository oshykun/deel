const moment = require('moment');

const DIRegistry = require('../lib/diRegistry');
// TODO: use services instead of models...
// const { contractService } = DIRegistry.services;
const { Contract, Job, Profile } = DIRegistry.models;
const Op = DIRegistry.sequelize.Op;

const { PROFILE_TYPES, DATE_FORMAT } = require('../lib/constants');

exports.getBestClients = async (req, res) => {
  // TODO: add validation for input params...
  const { start, end, limit = 2 } = req.query;
  const startDate = moment(start, DATE_FORMAT).startOf('day');
  const endDate = moment(end, DATE_FORMAT).startOf('day');

  const jobs = await Job.findAll({
    where: {
      paid: true,
      paymentDate: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
    },
    order: [['price', 'DESC']],
    include: [{
      model: Contract,
      include: [{
        association: 'Client',
        where: { type: PROFILE_TYPES.client },
      }],
    }],
  });

  const bestClients = jobs.reduce((result, currentJob) => {
    const id = currentJob.Contract.Client.id;
    const firstName = currentJob.Contract.Client.firstName;
    const lastName = currentJob.Contract.Client.lastName;
    const paid = currentJob.price;
    const fullName = `${firstName} ${lastName}`;

    // for caching
    if (!result[fullName]) {
      result[fullName] = { id, fullName, paid };
    }
    return result;
  }, {});

  // TODO: move limit to the DB query layer...
  const result = Object.values(bestClients).slice(0, +limit);
  return res.json({ result });
};

exports.getBestProfession = async (req, res) => {
  // TODO: add validation for input params...
  const { start, end } = req.query;
  const startDate = moment(start, DATE_FORMAT).startOf('day');
  const endDate = moment(end, DATE_FORMAT).startOf('day');

  const profiles = await Profile.findAll({
    where: {
      type: PROFILE_TYPES.contractor,
    },
    include: [{
      association: 'Contractor',
      include: [{
        model: Job, where: {
          paid: true,
          paymentDate: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
        },
      }],
    }],
  });

  const topProfessions = profiles.reduce((result, profile) => {
    const contracts = profile.Contractor;
    const profileContractsSum = contracts.reduce(
        (sumForAllContracts, contract) => {
          const singleContractSum = contract.Jobs.reduce(
              (jobsSum, job) => jobsSum + job.price, 0);
          return sumForAllContracts + singleContractSum;
        }, 0);

    if (!result[profile.profession] ||
        (result[profile.profession] < profileContractsSum)) {
      result[profile.profession] = profileContractsSum;
    }

    return result;
  }, {});

  const { profession } = Object.entries(topProfessions).
      reduce((res, [profession, sum]) => {
        if (sum > res.sum) {
          res.sum = sum;
          res.profession = profession;
        }
        return res;
      }, { profession: '', sum: 0 });

  return res.json({ result: profession });
};
