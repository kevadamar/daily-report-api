const { userService } = require('../service/userService');
const { updateUserSchema } = require('../validator/authSchema');

const get = async (req, res) => {
  try {
    const id = req.user.id;

    const {
      data,
      error: errorService,
      message,
      status,
    } = await userService.get(id);

    if (errorService) {
      return res.status(401).json({
        status,
        message,
      });
    }

    res.status(status).json({
      status,
      message,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
};

const update = async (req, res) => {
  try {
    const id = req.user.id;
    let payload = req.body;

    const { error } = updateUserSchema.validate(payload);

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const {
      data,
      error: errorService,
      message,
      status,
    } = await userService.update(id, req.file, payload);

    if (errorService) {
      return res.status(401).json({
        status,
        message,
      });
    }

    res.status(status).json({
      status,
      message,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error,
    });
  }
};

module.exports.userController = { get, update };
