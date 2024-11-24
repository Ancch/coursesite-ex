const { Router } = require("express");
const { userModel, purchaseModel } =require("../db");
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
        password: zod.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), 
        firstName: zod.string().min(3).max(100),
        lastName: zod.string().min(3).max(100),
    });

    const parsedData = requireBody.safeParse(req.body);

    if(!parsedData.success) {
        return res.json({
            message: "Incorrect format",
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

userRouter.post("/signin", async function(resq, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

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
    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
}