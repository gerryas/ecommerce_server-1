'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category);
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name is required'
        }
      }
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
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Price is required'
        },
        isNumeric: {
          msg: 'Price has to be in number format'
        },
        min: {
          args: [0],
          msg: `Price must be greater than or equal to 0`
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Stock is required'
        },
        isNumeric: {
          msg: 'Stock has to be in number format'
        },
        min: {
          args: [0],
          msg: `Stock must be greater than or equal to 0`
        }
      }
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};