const router = require('express').Router();
const CartController = require('../controllers/CartController');
const { authorizationCart, authorizationCust } = require('../middlewares/auth');

router.use(authorizationCust);
router.get('/', CartController.find);
router.post('/', CartController.add);
router.patch('/checkout', CartController.checkout);
router.patch('/:id', authorizationCart, CartController.patch);
router.delete('/:id', authorizationCart, CartController.delete);

module.exports = router;