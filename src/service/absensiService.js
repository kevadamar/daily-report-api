const { Op } = require('sequelize');
const { Absensi, User } = require('../models');
const subDays = require('date-fns/subDays');
const subMonths = require('date-fns/subMonths');

const absen = async (user_id, type, payload) => {
  try {
    let defaulReturn = { data: null, error: false, message: '', status: 200 };

    const checkAbsen = await Absensi.findOne({
      where: {
        tanggal_absensi: payload.tanggal_absensi,
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

    if (type.toLowerCase() === 'masuk') {
      if (checkAbsen?.check_in) {
        console.log(checkAbsen.check_in);
        defaulReturn.status = 400;
        defaulReturn.message = 'User sudah absen';
        defaulReturn.error = true;

        return defaulReturn;
      }
      await Absensi.create({ ...payload, user_id });
      defaulReturn.message = 'Successfully Check In';
    } else if (type.toLowerCase() === 'keluar') {
      if (checkAbsen?.check_out) {
        console.log(checkAbsen.check_out);
        defaulReturn.status = 400;
        defaulReturn.message = 'User sudah absen pulang';
        defaulReturn.error = true;

        return defaulReturn;
      }
      await Absensi.update(
        { check_out: payload.check_out },
        {
          where: {
            tanggal_absensi: payload.tanggal_absensi,
            user_id,
          },
        },
      );
      defaulReturn.message = 'Successfully Check Out';
    } else {
      defaulReturn.error = true;
      defaulReturn.status = 400;
      defaulReturn.message = 'Failed Absen';

      return defaulReturn;
    }

    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};
const absenFilter = async (user_id, type, start, end) => {
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

    const resultAbsen = await Absensi.findAll({
      where: {
        user_id,
        tanggal_absensi: {
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
    defaulReturn.data = resultAbsen;
    return defaulReturn;
  } catch (error) {
    console.log(error);
    defaulReturn.error = true;
    defaulReturn.message = 'Internal Server Error';
    defaulReturn.status = 500;

    return defaulReturn;
  }
};

module.exports.absensiService = { absen, absenFilter };
