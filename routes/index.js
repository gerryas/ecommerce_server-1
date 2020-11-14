const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/auth');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const bannerRouter = require('./bannerRouter');

router.post('/login', UserController.login);
router.use(authentication);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/banners', bannerRouter);

module.exports = router;