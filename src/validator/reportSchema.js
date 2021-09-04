const joi = require('joi');

exports.newSchema = joi.object({
  task_kemarin: joi.string().required(),
  task_sekarang: joi.string().required(),
  tanggal_report: joi.string().required(),
  kendala: joi.string().required(),
});

exports.updateSchema = joi.object({
  task_kemarin: joi.string(),
  task_sekarang: joi.string(),
  kendala: joi.string(),
  tanggal_report: joi.string().required(),
});
