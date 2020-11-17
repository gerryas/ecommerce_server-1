const router = require('express').Router();
const BannerController = require('../controllers/BannerController');
const { authentication, authorizationAdmin } = require('../middlewares/auth');

router.get('/', BannerController.findAll);
router.get('/:bannerId', BannerController.findOne);
router.use(authentication, authorizationAdmin);
router.post('/', BannerController.create);
router.put('/:bannerId', BannerController.update);
router.delete('/:bannerId', BannerController.delete);

module.exports = router;