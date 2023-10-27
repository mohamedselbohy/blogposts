const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const blogController = require('../controllers/blogController');
const {requireAuth} = require('../middleware/authMiddleware');

router.get('/blogs',blogController.blog_index);
router.post('/blogs',requireAuth,blogController.blog_create_post);
router.get('/blogs/create',requireAuth,blogController.blog_create_get);
router.get('/blogs/:id',blogController.blog_details);
router.delete('/blogs/:id',requireAuth,blogController.blog_delete);

router.get('/showmyposts',blogController.show_posts);


module.exports = router;