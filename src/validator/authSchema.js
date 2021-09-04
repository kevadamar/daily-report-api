const joi = require('joi');

exports.loginSchema = joi.object({
  nik: joi.string().min(16).required(),
  password: joi.string().min(8).required(),
});

exports.registerSchema = joi.object({
  nik: joi.string().min(16).required(),
  fullname: joi.string().min(3).required(),
  role_id: joi.string().required(),
  password: joi.string().min(8).required(),
});

exports.updateUserSchema = joi.object({
  nik: joi.string().min(16),
  fullname: joi.string().min(3),
  role_id: joi.string(),
  password: joi.string().min(8),
});
