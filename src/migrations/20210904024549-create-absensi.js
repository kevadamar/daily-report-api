'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('absensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      check_in: {
        type: Sequelize.STRING,
      },
      check_out: {
        type: Sequelize.STRING,
      },
      tanggal_absensi: {
        type: Sequelize.DATEONLY,
      },
      terlambat: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('absensis');
  },
};
