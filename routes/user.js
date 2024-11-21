const { Router } = require("express");
const { userModel } =require("../db");
const { hashPassword, comparePassword } = require("../helper");
const zod  = require("zod");

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

userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if(!user) {
        return res.json({
            message: "Incorrect credentials"
        });
    }

    const isValid = comparePassword(password, user.passoword);
    if(!isValid) {
        return res.json({
            message: "Incorrect password"
        });
    }

    res.json({
        message: "signup endpoint"
    })
})

userRouter.post("/purchases", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}