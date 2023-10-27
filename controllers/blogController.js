const Blog = require('../models/blog');
const User = require('../models/user');

const blog_index = (req,res)=>{
    let blogs = [];
    Blog.find().sort({createdAt: -1})
    .then((result)=>{
        blogs = result;
        res.render('index',{title:'blogs',blogs,user:res.locals.user})
    })
    .catch((err)=> console.log(err));
}
const show_posts = async (req,res)=>{

    const user = res.locals.user;
    console.log(user);
    if(user)
    {
    const blogids = user.posts;
    let blogs =[];
    try{
    for(let i=0;i<blogids.length;i++){
        const bg = await Blog.findById(blogids[i]);
        blogs.push(bg);
    }
    console.log(blogs);
    res.render('index',{title:'my posts',blogs,user:res.locals.user});
}
catch(err)
{
    console.log(err);
    res.render('index',{title:'my posts',blogs:[],user:res.locals.user});
}
}
else
{
    res.render('index',{title:'my posts',blogs:[],user:res.locals.user});
}
}

const blog_details = (req,res)=>{
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
    .then(result => {res.render('details',{title:result.title , blog: result,user:res.locals.user})})
    .catch(err=>{res.status(404).render('404',{title : 'post not found',user:res.locals.user})});
}

const blog_create_get =  (req, res) => {
    const user = res.locals.user;
    console.log(user);
    res.render('create', { title: 'Create a new blog' ,user:res.locals.user});
  }

const blog_create_post = async (req,res)=>{
    const blog = await new Blog(req.body.blog);
    const user = await User.findById(res.locals.user._id);
    console.log(user.username);
    await User.findByIdAndUpdate(user._id,{$push: {posts:blog._id}},{new:true});
    console.log(user.posts);
    blog.save()
    .then((result)=>{console.log(result);
    res.send('success');
    })
    .catch((err)=>console.log(err));
}

const blog_delete = (req,res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect : '/blogs'});
    })
    .catch(err=>console.log(err));
}



module.exports={
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
    show_posts
}