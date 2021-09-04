const joi = require('joi');

exports.masukSchema = joi.object({
  check_in: joi.string().required(),
  tanggal_absensi: joi.string().required(),
});

exports.keluarSchema = joi.object({
  check_out: joi.string().required(),
  tanggal_absensi: joi.string().required(),
});
