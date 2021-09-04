const { absensiService } = require('../service/absensiService');
const { masukSchema, keluarSchema } = require('../validator/absensiSchema');

const absenFilter = async (req, res) => {
  try {
    const type = req.query.type;
    const start = req.query.start;
    const end = req.query.end;
    const user_id = req.user.id;

    console.log(type);

    const {
      data,
      error: errorService,
      message,
      status,
    } = await absensiService.absenFilter(user_id, type, start, end);

    if (errorService) {
      return res.status(401).json({
        status,
        message,
      });
    }

    res.status(200).json({
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

const absen = async (req, res) => {
  try {
    const payload = req.body;
    const user_id = req.user.id;
    const type = req.params.type;

    if (type.toLowerCase() === 'masuk') {
      const { error } = masukSchema.validate(payload);

      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message,
        });
      }
    } else {
      const { error } = keluarSchema.validate(payload);

      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message,
        });
      }
    }

    const {
      data,
      error: errorService,
      message,
      status,
    } = await absensiService.absen(user_id, type, payload);

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

module.exports.absensiController = { absen, absenFilter };
