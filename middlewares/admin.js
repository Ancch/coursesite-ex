const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require('../config');

function adminmiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET)

    
}