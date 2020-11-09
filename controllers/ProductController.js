const { Category, Product } = require('../models');

class ProductController {
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

      res.status(201).json({
        name: newProduct.name,
        image_url: newProduct.image_url,
        price: newProduct.price,
        stock: newProduct.stock,
        CategoryId: newProduct.CategoryId
      });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;