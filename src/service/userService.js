const bcrypt = require('bcrypt');
const { User, Role } = require('../models');
const cloudinary = require('../config/cloudinary');

const get = async (id) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    let resultUser = await User.findOne({
      where: { id },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'role_id'],
      },
    });

    if (!resultUser) {
      defaulReturn.error = true;
      defaulReturn.status = 404;
      defaulReturn.message = 'Invalid User Token!';

      return defaulReturn;
    }
    resultUser = JSON.parse(JSON.stringify(resultUser));

    defaulReturn.message = 'Successfully Get User';
    defaulReturn.data = {
      ...resultUser,
      photo: !resultUser.photo ? null : resultUser.photo,
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

const update = async (id, file, payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    let resultUploadFile;

    const resultUser = await User.findOne({
      where: {
        id,
      },
      attributes: ['photo', 'cloudinary_id'],
    });
    if (!resultUser) {
      defaulReturn.error = true;
      defaulReturn.status = 404;
      defaulReturn.message = 'Invalid Update User!';

      return defaulReturn;
    }

    if (file) {
      if (resultUser.cloudinary_id) {
        await cloudinary.uploader.destroy(resultUser.cloudinary_id);
      }
      resultUploadFile = await cloudinary.uploader.upload(file.path);
    }

    if (!payload?.password) {
      await User.update(
        {
          ...payload,
          photo: resultUploadFile?.secure_url || resultUser.photo,
          cloudinary_id:
            resultUploadFile?.public_id || resultUser.cloudinary_id,
        },
        { where: { id } },
      );
    } else {
      const SALT = 10;
      const hashedPassword = await bcrypt.hash(payload.password, SALT);
      payload = { ...payload, password: hashedPassword };

      await User.update(payload, { where: { id } });
    }
    const { data } = await get(id);

    defaulReturn.message = 'Successfully Updated profile!';
    defaulReturn.data = data;

    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};

module.exports.userService = { get, update };
