const express = require('express');
const mongoose = require("mongoose");
const app = express();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

app.use('v1/user', userRouter);
app.use('v1/admin', adminRouter);
app.use('v1/course', courseRouter);


async function MediaDeviceInfo() {
    await mongoose.connect("mongodb+srv://annss167:VYKBwxfzxV7YHBZn@cluster0.usnvk.mongodb.net/course-app");
    app.listen(3000);
}
main()
