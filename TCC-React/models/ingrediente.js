'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingrediente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ingrediente.belongsToMany(models.Recipe,{
        through: 'ReceitaTemIngredientes',
        as: 'ingredientes',
        foreignKey: 'idIngrediente',
      });
    }
  }
  Ingrediente.init({
    ingredienteName: DataTypes.STRING,
    tipo: DataTypes.ENUM('Quantidade','Liquido','Peso'),
    pictureIngrediente: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ingrediente',
    timestamps: false
  });
  return Ingrediente;
};