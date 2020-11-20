const { Cart, Product, User, sequelize } = require('../models');

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
      const check = await Product.findByPk(ProductId)
      if (check.stock > 0) {
        const [ cart, created ] = await Cart.findOrCreate({
          where: {
            UserId,
            ProductId,
            status: false
          }
        })
        if (created) res.status(201).json(cart)
        else res.status(200).json(cart)
      } else {
        throw new Error ('Product stock is empty')
      }
    } catch (err) {
      next(err);
    }
  }

  static async patch (req, res, next) {
    const UserId = req.user.id;
    const ProductId = +req.params.id;
    const { amount } = req.body;
    try {

      const check = await Product.findByPk(ProductId);
      console.log(check.stock);
      if (amount <= check.stock) {
        const cart = await Cart.update({
          amount
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
      } else {
        throw new Error ('Product stock is empty')
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

  static async checkout (req, res, next) {
    const UserId = req.user.id;
    try {
      const carts = await Cart.update({
        status: true
      }, {
        where: {
          UserId,
          status: false
        },
        returning: true
      });

      if (carts[1].length === 0) {
        throw {
          name: 'NotFound'
        };
      }

      const checkout = await Promise.all(carts[1].map(async cart => {
        const done = await Product.update({
          stock: sequelize.literal(`stock - ${cart.amount}`)
        }, {
          where: {
            id: cart.ProductId
          },
          returning: true
        });
        return done; 
      }));

      const updated = checkout.map(el => el[1])

      res.status(200).json(updated)
    } catch (err) {
      next(err);
    }
  }

}

module.exports = CartController;