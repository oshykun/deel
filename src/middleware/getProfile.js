const DIRegistry = require('../lib/diRegistry');
const models = DIRegistry.models;
// TODO: use services instead of models...

const getProfile = async (req, res, next) => {
  const { Profile } = models;
  const profile = await Profile.findOne(
      { where: { id: req.get('profile_id') || 0 } });
  if (!profile) return res.status(401).end();
  req.profile = profile;
  next();
};
module.exports = { getProfile };
