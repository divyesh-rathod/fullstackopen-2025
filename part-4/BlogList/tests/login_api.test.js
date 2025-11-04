const { test, after, describe, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user')
const assert = require('node:assert');
const app = require('../app');

const api = supertest(app);

const initialUsers = [
  {
    name: 'Divyesh',
    userName: 'RD-123',
    password: '123456',
  },
  {
    name: 'Yansi',
    userName: 'RD-1234',
    password: '123456',
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

describe("to test success signup api", async () => {
    const NewUser = {
      name: 'Prem',
      userName: 'RD-12345',
      password: '123456',
    };
    test("SignUp Success", async()=> {
        await api
          .post('/api/auth/signUp')
          .send(NewUser)
          .expect(200)
            .expect('Content-Type', /application\/json/);
        
        const data = await api
          .get('/api/user/allUsers')
          .expect(201)
            .expect('Content-Type', /application\/json/);
        
        assert.strictEqual(initialUsers.length+1,data.body.length)
        

    })
    
})

describe("Invalid Username ", async () => {
     const NewUserWithoutUsername = {
       name: 'Prem',
       password: '123456',
    };
     const InvalidUserName = {
       name: 'Prem',
       userName: 'RD',
       password: '123456',
    };
     const duplicateUser = {
       name: 'Prem',
       userName: 'RD-1234',
       password: '123456',
     };
    test('No UsserName', async () => {
        await api
          .post('/api/auth/signUp')
          .send(NewUserWithoutUsername)
          .expect(401)
          .expect('Content-Type', /application\/json/);
       
    })
    test("Invalid UserName", async () => {
        await api
          .post('/api/auth/signUp')
          .send(InvalidUserName)
          .expect(400)
          .expect('Content-Type', /application\/json/);
    })
     test('Duplicate UserName', async () => {
       await api
         .post('/api/auth/signUp')
         .send(duplicateUser)
         .expect(400)
         .expect('Content-Type', /application\/json/);
     });

    
    
})

describe("Invalid Passwords", async () => {
    const InvalidPassword= {
    name: 'Divyesh',
    userName: 'RD-123',
    password: '12',
    }

    const MissingPassword = {
        name: 'Divyesh',
        userName: 'RD-123',
      };

     test('Invalid Password', async () => {
       await api
         .post('/api/auth/signUp')
         .send(InvalidPassword)
         .expect(401)
         .expect('Content-Type', /application\/json/);
     });
    
      test('missing password', async () => {
        await api
          .post('/api/auth/signUp')
          .send(MissingPassword)
          .expect(401)
          .expect('Content-Type', /application\/json/);
      });
    
    
    
})




after(async () => {
  await mongoose.connection.close();
});