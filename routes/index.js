const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/auth');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');

router.post('/login', UserController.login);
router.use(authentication);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);

module.exports = router;