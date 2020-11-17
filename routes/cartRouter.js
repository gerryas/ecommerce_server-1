const router = require('express').Router();
const CartController = require('../controllers/CartController');
const { authorizationCart, authorizationCust } = require('../middlewares/auth');

router.use(authorizationCust);
router.get('/', CartController.find);
router.post('/', CartController.add);
router.use(authorizationCart);
router.patch('/:id', CartController.patch);
router.delete('/:id', CartController.delete);

module.exports = router;