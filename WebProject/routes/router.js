const router = require('express').Router();
const user = require('../controller/user');
const userController = require('../controller/user');


router.get('/', userController.index);

router.get('/login', userController.login);
router.post('/login',userController.loginPost);

router.get('/register',userController.register);
router.post('/register',userController.registerPost);

router.get('/logout',userController.logout);

router.get('/cart',userController.cart);

router.get('/addToCart/:id',userController.addToCart);

router.get('/deletItem/:id',userController.deleteItem);
router.post('/buy/:id',userController.buyItems);

router.get('/history',userController.history);
router.get('/yourOrder/:id',userController.userOrder);

module.exports = router;