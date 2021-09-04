'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'users',
      [
        {
          nik: '3671548925612354',
          name: 'Teguh',
          role_id: 1,
          password:
            '$2b$10$iW4WoWjHbN1FKS8UN19fsOiMu.Oeu3cANu8N0vqkOzSfWKtdcaENO', // -> password : 12345678
          photo: null,
          cloudinary_id: null,
        },
        {
          nik: '3671548925612355',
          name: 'Keva Damar Galih',
          role_id: 2,
          password: '$2b$10$iW4WoWjHbN1FKS8UN19fsOiMu.Oeu3cANu8N0vqkOzSfWKtdcaENO',// -> password : 12345678
          photo: null,
          cloudinary_id: null,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
