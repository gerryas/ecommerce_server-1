const { User } = require('../models');
const { comparePassword } = require('../helpers/hash');
const { loginToken } = require('../helpers/jwt');

class UserController {
  static async login (req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email
        }
      });
      
      if (!user) {
        throw {
          name: 'InvalidUserPassword'
        }
      } else if (!comparePassword(password, user.password)) {
        throw {
          name: 'InvalidUserPassword'
        }
      } else {
        const access_token = loginToken({
          id: user.id,
          email
        });
        res.status(200).json({ 
          access_token, 
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role 
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;