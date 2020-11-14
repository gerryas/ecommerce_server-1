const { Category, Banner } = require('../models');

class BannerController {
  static async findAll (req, res, next) {
    try {
      const banners = await Banner.findAll();
      res.status(200).json(banners);
    } catch (err) {
      next(err);
    }
  }

  static async findOne (req, res, next) {
    const id = +req.params.bannerId
    try {
      const banner = await Banner.findByPk(id);
      if (!banner) {
        throw {
          name: 'NotFound'
        };
      } else {
        res.status(200).json(banner);
      }
    } catch (err) {
      next(err);
    }
  }

  static async create (req, res, next) {
    let {
      title, 
      image_url, 
      status, 
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

      const newBanner = await Banner.create({
        title,
        image_url,
        status,
        CategoryId
      });

      res.status(201).json(newBanner);

    } catch (err) {
      next(err);
    }
  }

  static async update (req, res, next) {
    const id = +req.params.bannerId;
    let {
      title, 
      image_url, 
      status, 
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

      const updatedBanner = await Banner.update({
        title,
        image_url,
        status,
        CategoryId
      }, {
        where: {
          id
        },
        returning: true
      });

      if(updatedBanner[1].length > 0) {
        res.status(200).json(updatedBanner[1][0]);
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
    const id = +req.params.bannerId;
    try {
      const deletedBanner = await Banner.destroy({
        where: {
          id
        }
      });

      if(deletedBanner) {
        res.status(200).json({
          message: 'Banner deleted'
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

module.exports = BannerController;