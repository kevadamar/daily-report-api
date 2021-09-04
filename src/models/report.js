'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Report.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      });
    }
  }
  Report.init(
    {
      task_kemarin: DataTypes.STRING,
      task_sekarang: DataTypes.STRING,
      kendala: DataTypes.STRING,
      tanggal_report: DataTypes.DATEONLY,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Report',
      tableName: 'reports',
    },
  );
  return Report;
};
