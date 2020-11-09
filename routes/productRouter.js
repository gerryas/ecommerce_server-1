const router = require('express').Router();
const ProductController = require('../controllers/ProductController');

router.post('/', ProductController.create);

module.exports = router;