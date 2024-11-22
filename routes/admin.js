const { Router, application } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");

const { hashPassword, comparePassword } = require("../helper");
const zod  = require("zod");
const jwt  = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require("../config");
const { adminmiddleware } = require("../middlewares/admin");

adminRouter.post("/signup", async function(req, res) {
    const requireBody = zod.object({
        email: zod.string().min(3).max(100).email(),
        password: zod.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), 
        firstName: zod.string().min(3).max(100),
        lastName: zod.string().min(3).max(100),
    });
    console.log("check1");
    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success) {
        return res.json({
            message: "Incorrect format",
            error: parsedData.error.errors,
        });
    }
    
    const { email, password, firstName, lastName } = parsedData.data;
    console.log("check2");
    // Hash password
    try {
        const adminDB = await adminModel.findOne({
            $or: [{ email: email }, { firstName: firstName }, { lastName: lastName }]
        });

        if(!adminDB){
            const hashedpassword = hashPassword(password);
            await adminModel.create({
                email: email,
                password: hashedpassword,
                firstName: firstName,
                lastName: lastName
            })
            res.json({
                message: "You are signed up"
            })
        } else {
            res.status(400).json({
            message: "User already exists!"
            })
        }
    }
    catch(error) {
        console.error("An error occurred:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
})

adminRouter.post("/login", async function(req, res) {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    const isValid = comparePassword(password, admin.password);
    console.log('authenticated');
    if(!isValid) {
         return res.status(401).json({
            message: "Incorrect password"
        });
    }

    const token = jwt.sign({
        id: admin._id
    }, JWT_ADMIN_SECRET);

    // Need to change to cookie logic

    res.json({
        token: token
    });
})

adminRouter.post("/course", adminmiddleware, async function(req, res) {
    const adminid = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        // creating a web3 saas in 6 hours, to get actual img file by the user
        title, description, imageUrl, price, creatorId: adminId
    })


    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", function(req, res) {
    res.json({
        message: "admin change course content endpoint"
    })
})

adminRouter.get("/course/bulk", function(req, res) {
    res.json({
        message: "admin get courses endpoint"
    })
})

adminRouter.post("/delete", function(req, res) {
    res.json({
        message: "admin delete course endpoint"
    })
})


module.exports = {
    adminRouter: adminRouter
}