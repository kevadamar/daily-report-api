'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        as: 'role',
        foreignKey: 'role_id',
      });

      User.hasMany(models.Absensi, {
        as: 'absensis',
        foreignKey: 'user_id',
      });
      User.hasMany(models.Report, {
        as: 'reports',
        foreignKey: 'user_id',
      });
    }
  }
  User.init(
    {
      nik: DataTypes.BIGINT,
      fullname: DataTypes.STRING,
      password: DataTypes.STRING,
      photo: DataTypes.STRING,
      cloudinary_id: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  );
  return User;
};
