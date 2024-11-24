const { Router } = require("express");
const courseRouter = Router();
const { usermiddleware } = require("../middlewares/user");
const { purchaseModel, courseModel } = require("../db");

courseRouter.post("/purchase", usermiddleware, async function(req, res) {
    const userId =req.userId;
    const courseId = req.courseId;

    // should check user paid for the course
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "you have bought the course"
    })
})

courseRouter.get("/preview", usermiddleware, async function(req, res) {
    const courses = await courseModel.find({})
    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}