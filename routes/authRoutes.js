//Routes for authentication
const express = require("express");
const router = express.Router();

// Fetching user model
const User = require("../models/user")

//Adding user
router.post("/register", async (req, res) => {
    try {
        const { username, password, email, firstname, surname } = req.body;

        const user = new User({ username, password, email, firstname, surname });

        await user.save();
        return res.status(201).json({ message: "User created"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Logging in user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validating user
        if(!username || !password) {
            res.status(400).json({ error: "Invalid username or password" });
        }

        //Validating user
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const passwordMatch = await user.comparePassword(password);
        if(!passwordMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        } else {
            res.status(200).json({ message: "User logged in" });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
