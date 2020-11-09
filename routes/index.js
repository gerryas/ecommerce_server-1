const router = require('express').Router();
const UserController = require('../controllers/UserController');
const { authentication, authorizationAdmin } = require('../middlewares/auth');
const productRouter = require('./productRouter');

router.post('/login', UserController.login);
router.use(authentication);
router.use(authorizationAdmin);
router.use('/products', productRouter);

module.exports = router;