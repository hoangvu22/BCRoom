'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return Promise.all([
        queryInterface.addColumn('Reviews', 'customerId', {
            type: Sequelize.DataTypes.UUID,
            references: {
                model: 'Customers',
                key: 'customerId'
            }
        }),
        queryInterface.addColumn('Reviews', 'hotelId', {
            type: Sequelize.DataTypes.UUID,
            references: {
                model: 'Hotels',
                key: 'hotelId'
            }
        })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return Promise.all([
        queryInterface.removeColumn('Reviews', 'customerId'),
        queryInterface.removeColumn('Reviews', 'hotelId')
    ])
  }
};
