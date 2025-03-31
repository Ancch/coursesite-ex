const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require('../config');

function adminmiddleware(req, res, next) {
    console.log("checking for token....")
    const token = req.cookies?.admin_token;

    console.log("token received:", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
        console.log("Decoded code:", decoded);
        req.userId = decoded.id
        next();
    } catch (err) {
        console.error("Token verificatio fial", err);
        return res.status(403).json({ message: "Invalid token" });
    }

};

module.exports = {
    adminmiddleware: adminmiddleware
}
