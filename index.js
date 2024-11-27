const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
})
app.use(express.json());

app.use('/v1/user', userRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1/course', courseRouter);


async function main() {
    // dotend to keep env variables in seperate file
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log("server running on ${PORT}");
        });
    } catch (error) {
        console.error('Database connection error', error.message);
        process.exit(1);
    }
    
}
main()
