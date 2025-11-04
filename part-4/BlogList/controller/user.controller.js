const userRouter = require('express').Router();
const User = require('../models/user');
const middleware = require('../utils/middleware')

userRouter.use(middleware.authenticate)

userRouter.get('/allUsers', async (req, res) => {
    try {
      console.log(req.user)
    const allUsers = await User.find({});
    if (allUsers) {
      return res.status(201).json(allUsers);
    }
    return res.status(404).json('Something wrong with database');
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter
