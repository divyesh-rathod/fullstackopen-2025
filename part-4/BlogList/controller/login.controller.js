const loginRouter = require('express').Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../utils/config')
const middleware = require('../utils/middleware')

const User = require('../models/user');



loginRouter.post('/signUp', async (req, res,) => {
    try {
        const { name, userName, password } = req.body;
        if (!userName || !password) {
          return res.status(401).json(`Password or username is missing`);
        }
        if (password.length < 3) {
            return res.status(401).json(`Password must be of 3 or more characters`)
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            name,
            userName,
            password: hashedPassword
        });

        const createdUser = await newUser.save()
        const payload = {
          name: createdUser.name,
          userName: createdUser.userName,
          id: createdUser.id,
        };
        const token = jwt.sign(payload, config.SECRET, { expiresIn: '15d' })
        const user = {
          name: createdUser.name,
          userName: createdUser.userName,
      
          token,
        };
 return res.status(201).json(user);
    } catch (error) {
          res.status(400).json({ error: error.message });
    }
    
})
 

loginRouter.post('/login', async (req,res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(401).json(`Password or username is missing`)
        }
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(401).json("user does not exists or username invalid")
        }
        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            return res.status(401).json("invalid password please try again")
        }
         const payload = {
           name: user.name,
           userName: user.userName,
           id: user.id,
         };
        const token = jwt.sign(payload, config.SECRET, { expiresIn: '15d' });
        const data = {
            ...payload,
          
            token
        }
        return res.status(200).json(data);
    } catch (error) {
         res.status(400).json({ error: error.message });
    }
})


module.exports = loginRouter;
