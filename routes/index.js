const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/auth');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const bannerRouter = require('./bannerRouter');
const cartRouter = require('./cartRouter');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);
router.use(authentication);
router.use('/carts', cartRouter);

module.exports = router;