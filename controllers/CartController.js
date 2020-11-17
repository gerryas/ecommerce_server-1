const { Cart, Product, User } = require('../models');

class CartController {
  static async find (req, res, next) {
    const UserId = req.user.id;
    try {
      const cart = await User.findByPk(UserId, {
        include: Product,
        attributes: {
          exclude: ['password']
        }
      });

      res.status(200).json(cart);
    } catch (err) {
      next(err);
    }
  }

  static async add (req, res, next) {
    const UserId = req.user.id;
    const { ProductId } = req.body;
    try {
      const cart = await Cart.create({
        UserId,
        ProductId
      });

      res.status(201).json(cart)
    } catch (err) {
      next(err);
    }
  }

  static async patch (req, res, next) {
    const UserId = req.user.id;
    const ProductId = +req.params.id;
    const { amount, status } = req.body;
    try {
      const cart = await Cart.update({
        amount,
        status
      }, {
        where: {
          ProductId,
          UserId
        },
        returning: true
      });

      if (cart[1].length > 0) {
        res.status(200).json(cart[1][0]);
      } else {
        throw {
          name: 'NotFound'
        };
      }

    } catch (err) {
      next(err);
    }
  }

  static async delete (req, res, next) {
    const UserId = req.user.id;
    const ProductId = +req.params.id;
    try {
      const cart = await Cart.destroy({
        where: {
          UserId,
          ProductId
        }
      });

      if (cart) {
        res.status(200).json({
          message: 'Cart deleted'
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

module.exports = CartController;