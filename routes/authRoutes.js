const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');



router.get('/login',userAuthController.user_login_get);
router.post('/login',userAuthController.user_login_post);
router.get('/signup',userAuthController.user_create_get);
router.post('/signup',userAuthController.user_create_post);
router.get('/logout',userAuthController.user_logout_get)

module.exports = router;