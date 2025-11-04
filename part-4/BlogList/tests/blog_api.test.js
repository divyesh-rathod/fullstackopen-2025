const { test, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog')
const helper = require('./test_helper');
const assert = require('node:assert');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);


beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});
  await helper.addUser();
});



test('getApi', async () => {
    await api
      .get('/api/blogs')
      .expect(201)
      .expect('Content-Type', /application\/json/);
});

test('unique identifier property is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(201)
    .expect('Content-Type', /application\/json/);


  const blog = response.body[0];

  assert.ok(blog.id, 'there is ID');
  assert.strictEqual(blog._id, undefined);
  assert.strictEqual(blog.__v, undefined);
});

describe("Addition of a new Blog", async () => {
    test('should add one blog that has the right content', async () => {
      const blogsAtStart = await helper.allBlogs();
      const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.NewBlog);
      const newBlog = response.body
      const blogsAtEnd = await helper.allBlogs();

      assert.strictEqual(newBlog.title, helper.NewBlog.title);
      assert.strictEqual(newBlog.author, helper.NewBlog.author);
      assert.strictEqual(newBlog.url, helper.NewBlog.url);
      assert.strictEqual(newBlog.user.username, loggedUser.body.username);
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    });
})

test("Missing Like defaults to 0", async () => {
   const blogsAtStart = await helper.allBlogs();
   const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
   const response = await api
     .post('/api/blogs')
     .set('Authorization', `Bearer ${loggedUser.body.token}`)
     .send(helper.NewBlog0Likes)
     .expect(201)
    .expect('Content-Type', /application\/json/);
   const newBlog = response.body;
   const blogsAtEnd = await helper.allBlogs();
    
      
      
         assert.strictEqual(newBlog.likes, 0);
         assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
    
})

describe("Missing url or title", async () => {
  

  test("Missing Url", async () => {
      const blogsAtStart = await helper.allBlogs();
      const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${loggedUser.body.token}`)
          .send(helper.NewBlogMissingUrl)
          .expect(400)
          .expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.allBlogs();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

       
    })
     test('Missing Title', async () => {
       const blogsAtStart = await helper.allBlogs();
       const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
       await api
         .post('/api/blogs')
         .set('Authorization', `Bearer ${loggedUser.body.token}`)
         .send(helper.NewBlogMissingUrl)
         .expect(400)
         .expect('Content-Type', /application\/json/);
       const blogsAtEnd = await helper.allBlogs();
       assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
     });

})

test("testing delete api", async () => {
    
     const blogsAtStart = await helper.allBlogs();
     
  const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${loggedUser.body.token}`)
    .send(helper.NewBlog);
  const id = response.body.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .expect(204);
    const finalBlogs = await api
      .get('/api/blogs')
      .expect(201)
      .expect('Content-Type', /application\/json/);
    assert.strictEqual(finalBlogs.body.length, blogsAtStart.length);
    
},)

test("Put Api Test", async () => {
    let data = await api
      .get('/api/blogs')
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const id = data.body[0].id;
   const updatedLikes = {
        likes: 5045,
  };
  const loggedUser = await api.post('/api/auth/login').send(helper.loginUser);
    await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(updatedLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);
     const newData = await api
       .get('/api/blogs')
       .expect(201)
        .expect('Content-Type', /application\/json/);
    const finalLikes = newData.body.map(data => data.likes);
    assert.strictEqual(newData.body.length,helper.initialBlogs.length)
    assert(finalLikes.includes(5045))


    
})





after(async () => {
  await mongoose.connection.close();
});






