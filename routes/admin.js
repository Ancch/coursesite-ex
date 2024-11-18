const { Router, application } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");


adminRouter.post("/signup", function(req, res) {
    res.json({
        message: "admin signup endpoint"
    })
})

adminRouter.post("/login", function(req, res) {
    res.json({
        message: "admin login endpoint"
    })
})

adminRouter.post("/course", function(req, res) {
    res.json({
        message: "admin create course endpoint"
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