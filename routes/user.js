const { Router } = require("express");
const { userModel, purchaseModel, courseModel } =require("../db");
const { hashPassword, comparePassword } = require("../helper");
const zod  = require("zod");
const jwt  = require('jsonwebtoken');
const { JWT_USER_SECRET } = require("../config");
const { usermiddleware } = require("../middlewares/user");

const userRouter = Router();


userRouter.post('/signup', async function(req, res) { 
    // zod validation
    const requireBody = zod.object({
        email: zod.string().min(3).max(100).email(),
        password: zod.string().min(5).max(100)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
                message: "Password must be at least 5 characters long and include a mix of lowercase, uppercase, numbers, and special characters.",
            }), 
        firstName: zod.string().min(3, "First name should be at least 3 characters long").max(100),
        lastName: zod.string().min(3, "Last name should be at least 3 characters long").max(100),
    });

    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success) {

        const fieldErrors = parsedData.error.formErrors.fieldErrors;
        if (fieldErrors.email) {
            return res.status(201).json({
                message: "Incorrect email format",
                error: parsedData.error.errors,
            });
        }
        if (fieldErrors.password) {
            return res.status(400).json({
                message: fieldErrors.password[0],
                error: fieldErrors.password,
            });
        }
        if (fieldErrors.firstname) {
            return res.status(400).json({
                message: fieldErrors.firstName[0],
                error: fieldErrors.firstName,
            });
        }
        if (fieldErrors.lastName) {
            return res.status(400).json({
                message: fieldErrors.lastName[0],
                error: fieldErrors.lastName,
            });
        }
        return res.status(400).json({
            message: "Invalid input data",
            error: parsedData.error.errors,
        }); 
    }
    
    const { email, password, firstName, lastName } = parsedData.data;

    // Hash password
    try {
        const userDB = await userModel.findOne({
            $or: [{ email: email }, { firstName: firstName }, { lastName: lastName }]
        });

        if(!userDB){
            const hashedpassword = await hashPassword(password);
            await userModel.create({
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

userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    console.log("mhmm");
    const isValid = comparePassword(password, user.password);
    console.log('authenticated');
    if(!isValid) {
         return res.status(401).json({
            message: "Incorrect password"
        });
    }


    const token = jwt.sign({
        id: user._id
    }, JWT_USER_SECRET);

    // Need to change to cookie logic

    res.json({
        token: token
    });
   
        
    

})

userRouter.get("/purchases", usermiddleware, async function(req, res) {
    const userId = req.userId;

    await purchaseModel.find({
        userId
    })

    let purchasedCourseIds =  [];
    for (let i = 0; i< purchases.length; i++) {
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const courseData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })
    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}