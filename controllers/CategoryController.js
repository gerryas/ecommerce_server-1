const { Category, Product } = require('../models');

class CategoryController {
  static async findAll (req, res, next) {
    try {
      const categories = await Category.findAll({
        include: Product
      });
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;