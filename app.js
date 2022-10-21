const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();

dotenv.config({path: './config.env'});

require('./db/conn');

app.use(express.json());

app.use(require('./router/auth'));

const PORT =process.env.PORT; 

const middleware = (req, res, next) => {
    console.log("Hello my Middleware");
    next();
}

app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
})