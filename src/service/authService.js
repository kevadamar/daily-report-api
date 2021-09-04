const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const login = async (payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    const { nik, password } = payload;

    let resultUser = await User.findOne({
      where: {
        nik,
      },
      include: {
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'role_id'],
      },
    });
    if (!resultUser) {
      defaulReturn.error = true;
      defaulReturn.status = 400;
      defaulReturn.message = 'Invalid Credentials';

      return defaulReturn;
    }

    resultUser = JSON.parse(JSON.stringify(resultUser));

    const isValidPassword = bcrypt.compareSync(password, resultUser.password);

    if (!isValidPassword) {
      defaulReturn.error = true;
      defaulReturn.status = 401;
      defaulReturn.message = 'Invalid Credentials';

      return defaulReturn;
    }
    const token = jwt.sign(
      {
        id: resultUser.id,
        role_id: resultUser.role.id,
        role: resultUser.role.name,
        email: resultUser.email,
        fullname: resultUser.fullname,
      },
      process.env.SECRET_KEY,
    );

    console.log(resultUser);

    defaulReturn.message = 'Successfully Login';
    defaulReturn.data = {
      user: {
        fullname: resultUser.fullname,
        role: resultUser.role.name,
        photo: !resultUser.photo ? null : resultUser.photo,
      },
      token,
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

const register = async (payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    let data = payload;
    const { nik, password } = data;
    const checkNIK = await User.findOne({
      where: {
        nik,
      },
    });

    if (checkNIK) {
      defaulReturn.error = true;
      defaulReturn.status = 400;
      defaulReturn.message = 'NIK Already Registered';

      return defaulReturn;
    }

    const SALT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT);
    data = {
      ...data,
      password: hashedPassword,
    };

    let resultCreated = await User.create(data);

    const resultUser = await User.findOne({
      where: {
        nik: resultCreated.nik,
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });

    const token = jwt.sign(
      {
        id: resultUser.id,
        role_id: resultUser.role.id,
        role: resultUser.role.name,
        email: resultUser.email,
        fullname: resultUser.fullname,
      },
      process.env.SECRET_KEY,
    );

    defaulReturn.message = 'Successfully Register';
    defaulReturn.data = {
      user: {
        fullname: resultUser.fullname,
        role: resultUser.role.name,
        photo: !resultUser.photo ? null : resultUser.photo,
      },
      token,
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

module.exports.authService = { login, register };
