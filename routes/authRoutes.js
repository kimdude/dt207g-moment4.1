//Routes for authentication and authorization
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Fetching user model
const User = require("../models/user");

router.get("/", (req, res) => {
    res.json( "Welcome to this API!" );
})

//Adding user
router.post("/register", async (req, res) => {
    try {
        let { username, password, email, firstname, surname } = req.body;
        

        const user = new User({ username, password, email, firstname, surname });

        await user.save();
        return res.status(201).json({ message: "User created"});

    } catch (error) {
        res.status(500).json({ error: "Server error" });
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
            //Creating JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h"});
            const response = {
                message: "User logged in",
                token: token
            }

            res.status(200).json({ response });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Protected route
router.get("/protected", authenticateToken, async (req, res) => {
    const username = req.body.username
    const user = await User.findOne({ username });

    let loggedUser = {
        username: username,
        email: user.email,
        firstname: user.firstname,
        surname: user.surname,
        created: user.created
    }
    
    //Sending user info
    res.json({ loggedUser })
});

//Middleware validating Token
function authenticateToken(req, res, next) {
    //Checking authentication header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1] 

    //Token missing
    if(token == null) {
        res.status(401).json({ message: "Not authorized for this route - token missing"});
    }

    //Verifying token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, username) => {
        if(error) {
            return res.status(403).json({ message: "Invalid JWT"});
        }

        req.username = username;

        //Sending back to route if correct token
        next();
    })
}

module.exports = router;