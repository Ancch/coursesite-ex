const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
console.log(process.env.MONGO_URI)

const app = express();

const MONGO_URI = process.env.MONGO_URI;

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

app.use('v1/user', userRouter);
app.use('v1/admin', adminRouter);
app.use('v1/course', courseRouter);


async function main() {
    // dotend to keep env variables in seperate file
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected");
        app.listen(3000);
    } catch (error) {
        console.error('Database connection error', error.message);
        process.exit(1);
    }
    
}
main()
