'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Absensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Absensi.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      });
    }
  }
  Absensi.init(
    {
      check_in: DataTypes.STRING,
      check_out: DataTypes.STRING,
      tanggal_absensi: DataTypes.DATEONLY,
      terlambat: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Absensi',
      tableName: 'absensis',
    },
  );
  return Absensi;
};
