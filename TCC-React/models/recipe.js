'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipe.belongsTo(models.User);
      Recipe.belongsToMany(models.Ingrediente,{
        through: 'ReceitaTemIngredientes',
        as: 'receitas',
        foreignKey: 'idReceita',
      });
    }
  }
  Recipe.init({
    recipeName: DataTypes.STRING,
    pictureReceita: DataTypes.STRING,
    desc: DataTypes.STRING,
    category: DataTypes.STRING,
    ModoPreparo: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};