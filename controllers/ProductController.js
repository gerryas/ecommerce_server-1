const { Category, Product } = require('../models');

class ProductController {
  static async findAll (req, res, next) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  static async findOne (req, res, next) {
    const id = +req.params.productId
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw {
          name: 'NotFound'
        };
      } else {
        res.status(200).json(product);
      }
    } catch (err) {
      next(err);
    }
  }

  static async create (req, res, next) {
    let {
      name, 
      image_url, 
      price, 
      stock, 
      category   
    } = req.body;
    try {
      if (!category.trim()) category = 'general';
      else category = category.toLowerCase();

      const checkCat = await Category.findOne({
        where: {
          name: category
        }
      });

      let CategoryId;

      if (!checkCat) {
        const newCat = await Category.create({ name: category });
        CategoryId = newCat.id;
      } else {
        CategoryId = checkCat.id;
      }

      const newProduct = await Product.create({
        name,
        image_url,
        price,
        stock,
        CategoryId
      });

      res.status(201).json(newProduct);

    } catch (err) {
      next(err);
    }
  }

  static async update (req, res, next) {
    const id = +req.params.productId;
    let {
      name, 
      image_url, 
      price, 
      stock, 
      category   
    } = req.body;
    try {
      if (!category.trim()) category = 'general';

      const checkCat = await Category.findOne({
        where: {
          name: category
        }
      });

      let CategoryId;

      if (!checkCat) {
        const newCat = await Category.create({ name: category });
        CategoryId = newCat.id;
      } else {
        CategoryId = checkCat.id;
      }

      const updatedProduct = await Product.update({
        name,
        image_url,
        price,
        stock,
        CategoryId
      }, {
        where: {
          id
        },
        returning: true
      });

      if(updatedProduct[1].length > 0) {
        res.status(200).json(updatedProduct[1][0]);
      } else {
        throw {
          name: 'NotFound'
        };
      }
    } catch (err) {
      next(err)
    }
  }

  static async delete (req, res, next) {
    const id = +req.params.productId;
    try {
      const deletedProduct = await Product.destroy({
        where: {
          id
        }
      });

      if(deletedProduct) {
        res.status(200).json({
          message: 'Product deleted'
        });
      } else {
        throw {
          name: 'NotFound'
        };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;