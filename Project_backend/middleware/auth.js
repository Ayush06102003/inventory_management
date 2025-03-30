const jwt = require('jsonwebtoken');
const Admin = require('../Models/adminModel');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];  // Extract token
    }

    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Include department from JWT token payload
        const user = await Admin.findById(decoded.id).select("-password");
        
        if (!user) {
            return next(new ErrorResponse("No user found with this ID", 404));
        }

        // Attach the user and department info to the request object
        req.user = user;
        req.department = decoded.department;   // Extracted department from token payload
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ErrorResponse("Session expired. Please log in again.", 401));
        } else {
            return next(new ErrorResponse("Not authorized to access this route", 401));
        }
    }
};

module.exports = { protect };
