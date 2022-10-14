'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ingredientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ingredienteName: {
        type: Sequelize.STRING
      },
      tipo:{
        type: Sequelize.ENUM('Quantidade','Liquido','Peso')
      },
      pictureIngrediente:{
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ingredientes');
  }
};