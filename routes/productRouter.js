const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const { authentication, authorizationAdmin } = require('../middlewares/auth');

router.get('/', ProductController.findAll);
router.get('/:productId', ProductController.findOne);
router.use(authentication, authorizationAdmin);
router.post('/', ProductController.create);
router.put('/:productId', ProductController.update);
router.delete('/:productId', ProductController.delete);

module.exports = router;