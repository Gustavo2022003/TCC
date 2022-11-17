'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSegueUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSegueUser.init({
    idUserFollows: DataTypes.INTEGER,
    idUserFollowed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSegueUser',
  });
  return UserSegueUser;
};