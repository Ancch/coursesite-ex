const express = require('express');
const app = express();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

app.use('v1/user', userRouter);
app.use('v1/admin', adminRouter);
app.use('v1/course', courseRouter);

app.listen(3000);