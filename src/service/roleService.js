const { Role } = require('../models');

const getAll = async () => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    const resultRoles = await Role.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    defaulReturn.message = 'Successfully Get Roles';
    defaulReturn.data = resultRoles;

    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};

const store = async (payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    const resultCreated = await Roles.create(payload);

    defaulReturn.data = {
      name: resultCreated.name,
    };

    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};

module.exports.roleService = { getAll, store };
