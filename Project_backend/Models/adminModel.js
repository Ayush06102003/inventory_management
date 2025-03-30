const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format',
        },
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select: false,
    },
    department: {           // Added department field
        type: String,
        required: true
    },
    designation: {
        type: String,
    },
    address: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    isCreator: {
        type: Boolean,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

// Hashing password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
adminSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// JWT signing method including department
adminSchema.methods.getSignedToken = function () {
    return jwt.sign(
        { id: this._id, department: this.department },  // Include department in JWT
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Method to generate reset password token
adminSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
}

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
