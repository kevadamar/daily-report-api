const { reportService } = require('../service/reportService');
const { newSchema, updateSchema } = require('../validator/reportSchema');
const { Report, User } = require('../models');

const report = async (req, res) => {
  try {
    const user_id = req.user.id;
    const type = req.params.type;
    let payload = req.body;

    if (type === 'new') {
      const { error } = newSchema.validate(payload);

      if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message,
        });
      }
    } else {
      const { error } = updateSchema.validate(payload);

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
    } = await reportService.report(user_id, type, payload);

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

const reportFilter = async (req, res) => {
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
    } = await reportService.reportFilter(user_id, type, start, end);

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

const get = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.user.id;
    const resultReport = await Report.findOne({
      where: {
        id,
        user_id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullname'],
        },
      ],
    });

    if (!resultReport) {
      return res.status(404).json({
        status: 404,
        message: 'not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: resultReport,
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

module.exports.reportController = { report, reportFilter, get };
