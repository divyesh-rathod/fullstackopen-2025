const blogsRouter = require('express').Router();
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');
const User = require('../models/user');




blogsRouter.get('/', async (request, response) => {
  try {
    const data = await Blog.find({}).populate('user', { userName: 1, name: 1 });
    return response.status(201).json(data);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  
});
blogsRouter.use(middleware.authenticate);
blogsRouter.post('/', async (request, response) => {
  try {
    const user = await User.findById(request.user.id);
    const { title, likes, author, url } = request.body;
    const blog = new Blog({ title, likes, author, url, user: request.user.id });

    const savedBlog = await blog.save();
    console.log(savedBlog)
      user.blogs = (user.blogs || []).concat(savedBlog._id);
      await user.save();
  return response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
  
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const blog = await Blog.findById(id);
    if (blog.user.toString() === request.user.id) {
      const deleted = await Blog.findByIdAndDelete(id);
        if (!deleted) {
       return response.status(404).end(); 
      }
       return response.status(204).end(); 
    }
      return response.status(401).json("Invalid User")
   
  } catch (error) {
    return response.status(400).json({error:error.message})
  }
  
})


blogsRouter.put('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const data = request.body;
    const newData = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!newData) {
      return response.status(404).end(); // not found
    }

    return response.status(201).json(newData);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

module.exports = blogsRouter

