const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router(); 
const bcrypt = require('bcryptjs')

require('../db/conn');
const User = require("../model/userSchema")

router.get('/', (req, res) => {
    res.send('hello world grom the server Router js');
});

router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone  || !password || !cpassword) {
        return ResizeObserverSize.status(422).json({ error: "Plz filled the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" });
        }
        else {

            const user = new User({ name, email, phone, password, cpassword });

            //here you have to add becrypt so u did pre function userSchema
            await user.save();

            res.status(201).json({ message: "user registered successfully" });
        }
    }
    catch (err) {
        console.log(err);
    }

})

router.post('/signin', async (req, res) => {
     try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Plz filled the data" })
        }
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

              token = await userLogin.generateAuthToken();
             console.log(token);

             res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+ 25892000000),
                httpOnly:true
             });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials " });
            }
            else {
                res.json({ message: "User Signin successfully" })
            }
        } 
        else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;
