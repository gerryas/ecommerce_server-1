'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Banner.belongsTo(models.Category);
    }
  };
  Banner.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image_url: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Image is required'
        },
        isUrl: {
          msg: 'Image has to be in URL format'
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }
  }, {
    sequelize,
    modelName: 'Banner',
  });
  return Banner;
};