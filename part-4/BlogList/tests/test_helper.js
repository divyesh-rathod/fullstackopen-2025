const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');


   const NewBlogMissingTitle = {
       author: 'Divyesh Rathod',
       url: 'https://example.com/1',
       likes: 7,
    };
    
    const NewBlogMissingUrl = {
      title: 'First Blog 101',
      author: 'Divyesh Rathod',
      likes: 7,
    };

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'Divyesh Rathod',
    url: 'https://example.com/1',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Someone Else',
    url: 'https://example.com/2',
    likes: 7,
  },
];

  const NewBlog0Likes = {
    title: 'First Blog 101',
    author: 'Divyesh Rathod',
    url: 'https://example.com/1',
  };

 const NewBlog = {
   title: 'First Blog 101',
   author: 'Divyesh Rathod',
   url: 'https://example.com/1',
   likes: 7,
 };
const initialUsers = [
  {
    name: 'Divyesh',
    password: 'abrakadabra',
    userName: 'RD-123',
  },
  {
    name: 'Prem',
    password: 'abrakadabra',
    userName: 'RD-1234',
  },
];

const loginUser = {
  password: 'abrakadabra',
  userName: 'RD-123',
};
const SignupUser = {
    password: 'abrakadabra',
    userName: 'RD-123',
    name:"Divyesh"
};
const allBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const allUsers = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const addUser = async () => {
  const passwordHash = await bcrypt.hash(SignupUser.password, 10);
  const user = new User({
    userName: SignupUser.userName,
    password: passwordHash,
    name: SignupUser.name,
  });
  await user.save();
};



module.exports = {
  initialBlogs,
  NewBlogMissingTitle,
  NewBlogMissingUrl,
  NewBlog0Likes,
  NewBlog,
  initialUsers,
  allBlogs,
  allUsers,
  addUser,
  loginUser,
};