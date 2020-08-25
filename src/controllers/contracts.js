const DIRegistry = require('../lib/diRegistry');
// TODO: use services instead of models...
// const { contractService } = DIRegistry.services;
const { Contract } = DIRegistry.models;
const Op = DIRegistry.sequelize.Op;

const { PROFILE_TYPES, CONTRACT_STATUSES } = require('../lib/constants');

exports.getContractById = async (req, res) => {
  const { id: contractId } = req.params;
  const profile = req.profile;

  let where = { id: contractId };

  const [contract] = await (() => {
    if (profile.type === PROFILE_TYPES.client) {
      return profile.getClient({ where });
    }
    return profile.getContractor({ where });
  })();
  if (!contract) {
    return res.status(400).json({
      errors: [{
        message: 'Contract was not found!',
        code: 'NOT_FOUND',
      }],
    });
  }

  return res.json({ contract });
};

exports.getContracts = async (req, res) => {
  const profile = req.profile;

  const profileType = profile.type ===
                      PROFILE_TYPES.client ? 'ClientId' : 'ContractorId';

  let where = {
    status: {
      [Op.in]: [CONTRACT_STATUSES.in_progress, CONTRACT_STATUSES.new],
    },
    [profileType]: profile.id,
  };

  const contracts = await Contract.findAll({ where });

  return res.json({ contracts });
};
