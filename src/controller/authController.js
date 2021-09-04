const { authService } = require('../service/authService');
const { loginSchema, registerSchema } = require('../validator/authSchema');

const login = async (req, res) => {
  try {
    const payload = req.body;

    const { error } = loginSchema.validate(payload);

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
    } = await authService.login(payload);

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

const register = async (req, res) => {
  try {
    const payload = req.body;

    const { error } = registerSchema.validate(payload);

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
    } = await authService.register(payload);

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

module.exports.authController = { login, register };
