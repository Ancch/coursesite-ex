const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const cookieParser = require("cookie-parser");

const path = require("path");
const app = express();
const hbs = require("hbs");

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

const cors = require("cors");
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../week-8coursera-exsite/templates/views");
const partials_path = path.join(__dirname, "../week-8coursera-exsite/templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

console.log("Static Path:", static_path);
console.log("Templates Path:", templates_path);
console.log("Partials Path:", partials_path);

// const fs = require('fs');
// console.log("Index exists:", fs.existsSync(path.join(templates_path, "index.hbs")));


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/v1/user/signup", (req, res) => {
    res.render("usersignup");
})

app.get("/v1/user/signin", (req, res) => {
    res.render("usersignin");
})

app.get("/v1/admin", (req, res) => {
    res.render("admin");
})

app.get("/v1/admin/signup", (req, res) => {
    res.render("adminsignup");
})

app.get("/v1/admin/login", (req, res) => {
    res.render("adminlogin");
})

app.get("/v1/admin/course", (req, res) => {
    res.render("admincourse");
})

app.get("/v1/course/preview", (req, res) => {
    res.render("preview");
})

app.use(express.json());
app.use(cookieParser()); 

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

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

// const express = require('express');
// const mongoose = require("mongoose");
// require('dotenv').config();

// const app = express();

// const PORT = process.env.PORT;
// const MONGO_URI = process.env.MONGO_URI;

// const { userRouter } = require('./routes/user');
// const { courseRouter } = require('./routes/course');
// const { adminRouter } = require('./routes/admin');

// const cors = require("cors");


// app.use(express.static('../week-8coursera-exsite/public'));
// app.use(cors());

// app.get("/", function(req, res) {
//     res.sendFile(__dirname + "/public/index1.html");
// })



// app.use(express.json());

// app.use('/v1/user', userRouter);
// app.use('/v1/admin', adminRouter);
// app.use('/v1/course', courseRouter);


// async function main() {
//     // dotend to keep env variables in seperate file
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("Database connected");
//         app.listen(PORT, () => {
//             console.log("server running on ${PORT}");
//         });
//     } catch (error) {
//         console.error('Database connection error', error.message);
//         process.exit(1);
//     }
    
// }

// main()