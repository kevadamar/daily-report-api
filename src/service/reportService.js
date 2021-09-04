const { Op } = require('sequelize');
const { Report, User } = require('../models');
const subDays = require('date-fns/subDays');
const subMonths = require('date-fns/subMonths');

const report = async (user_id, type, payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };

    if (type === 'new') {
      const checkReport = await Report.findOne({
        where: {
          tanggal_report: payload.tanggal_report,
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
      if (checkReport) {
        defaulReturn.status = 400;
        defaulReturn.message = 'User sudah report';
        defaulReturn.error = true;

        return defaulReturn;
      }

      await Report.create({ ...payload, user_id });
    } else {
      await Report.update(payload, { where: { user_id } });
    }
    const checkReport = await Report.findOne({
      where: {
        user_id,
      },
    });

    defaulReturn.message = 'Successfully Report';
    defaulReturn.data = checkReport;

    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};
const reportFilter = async (user_id, type, start, end) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };
    const dateNow = new Date();
    const monthNow = dateNow.getMonth() + 1;
    const dayNow = dateNow.getDate();
    const yearsNow = dateNow.getFullYear();
    const totalDayInMonth = dateNow.getDate();
    let rangeDate;

    console.log(type);

    if (type === 'bulan') {
      const monthPast = subMonths(new Date(), 1).getMonth() + 1;
      const monthDayPast = subMonths(new Date(), 1).getDate();
      const yearPast = subMonths(new Date(), 1).getFullYear();
      rangeDate = [
        `${yearPast}-${
          monthPast < 10 ? '0' + monthPast : monthPast
        }-${monthDayPast}`,
        `${yearsNow}-${monthNow}-${totalDayInMonth}`,
      ];
    }

    if (type === 'minggu') {
      const dayPast = subDays(new Date(), 7).getDate();
      const yearPast = subDays(new Date(), 7).getFullYear();
      const monthPast = subDays(new Date(), 7).getMonth() + 1;
      rangeDate = [
        `${yearPast}-${monthPast < 10 ? '0' + monthPast : monthPast}-${
          dayPast < 10 ? '0' + dayPast : dayPast
        }`,
        `${yearsNow}-${monthNow < 10 ? '0' + monthNow : monthNow}-${
          dayNow < 10 ? '0' + dayNow : dayNow
        }`,
      ];
    }

    if (type === 'hari') {
      const yearPast = subDays(new Date(), 1).getFullYear();
      rangeDate = [
        `${yearPast}-${monthNow < 10 ? '0' + monthNow : monthNow}-${
          dayNow < 10 ? '0' + dayNow : dayNow
        }`,
        `${yearsNow}-${monthNow < 10 ? '0' + monthNow : monthNow}-${
          dayNow < 10 ? '0' + dayNow : dayNow
        }`,
      ];
    }

    if (start && end) {
      rangeDate = [start, end];
    }

    const resultReport = await Report.findAll({
      where: {
        user_id,
        tanggal_report: {
          [Op.between]: rangeDate,
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullname'],
        },
      ],
    });
    defaulReturn.data = resultReport;
    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};

module.exports.reportService = { report, reportFilter };
