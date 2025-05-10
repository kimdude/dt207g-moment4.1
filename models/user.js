//Routes for authentication
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Creating schema
const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "State username."],
        unique: true,
        trim: true,
        minLength: 5,
        maxLength: 20
    },
    password: {
        type: String,
        required: [true, "State password."],
        minLength: 8,
        maxLength: 20
    },
    email: {
        type: String,
        required: [true, "State email."],
        maxLength: 30
    },
    firstname: {
        type: String,
        required: false,
        maxLength: 15
    },
    surname: {
        type: String,
        required: false,
        maxLength: 20
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Hashing password
usersSchema.pre("save", async function(next) {
    try {
        if(this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }

        next();
    } catch(error) {
        next(error);
    }
});

//Registering user
usersSchema.statics.register = async function(username, password, email, firstname, surname) { 
    try {
        const user = new User({ username, password, email, firstname, surname});
        await user.save();
        return user;
    } catch(error) {
        throw error;
    }
};

//Comparing password
usersSchema.methods.comparePassword = async function(password) {
    try{
        return await bcrypt.compare(password, this.password);

    } catch(error) {
        throw error;

    }
}

const User = mongoose.model("User", usersSchema);
module.exports = User;