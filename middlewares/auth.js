const { verifyToken } = require('../helpers/jwt');
const { User, Cart } = require('../models');

const authentication = async (req, res, next) => {
  const access_token = req.headers.access_token;
  const decoded = verifyToken(access_token);
  try {
    if (!access_token) {
      throw {
        name: 'AuthenticationFailed'
      };
    } else if (!decoded) {
      throw {
        name: 'AuthenticationFailed'
      };
    } else {
      const { id, email } = decoded;
      const user = await User.findByPk(id);
      if(user) {
        req.user = { id, email, role: user.role };
        next();
      } else {
        throw {
          name: 'AuthenticationFailed'
        };
      }
    }
  } catch (error) {
    next(error);
  }
}

const authorizationAdmin = async (req, res, next) => {
  const { role } = req.user;

  try {

    if (role !== 'admin') {
      throw {
        name: 'AuthorizationFailed'
      };
    } else {
      next();
    }

  } catch (err) {
    next(err);
  }
}

const authorizationCust = async (req, res, next) => {
  const { role } = req.user
  try {
    if (role !== 'customer') {
      throw {
        name: 'AuthorizationFailed'
      }
    } else {
      next();
    }

  } catch (err) {
    next(err)
  } 
}

const authorizationCart = async (req, res, next) => {
  const UserId = req.user.id;
  const ProductId = +req.params.id;
  try {
    const cart = await Cart.findOne({
      where: {
        UserId,
        ProductId
      }
    });

    if (!cart) {
      throw {
        name: 'AuthorizationFailed'
      };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }

}

module.exports = {
  authentication,
  authorizationAdmin,
  authorizationCust,
  authorizationCart
}