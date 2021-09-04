const { roleService } = require('../service/roleService');

const getAll = async (req, res) => {
  try {
    const {
      data,
      error: errorService,
      message,
      status,
    } = await roleService.getAll();

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

module.exports.roleController = { getAll };
