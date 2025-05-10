//Requiring packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
require("dotenv").config();

//Connecting to MongoDb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting: " + error);
});

//Routes
app.use("/api", authRoutes);

//Protected route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected route!"})
});

//Validate Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1] 

    if(token == null) {
        res.status(401).json({ message: "Not authorized for this route - token missing"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, username) => {
        if(error) {
            return res.status(403).json({ message: "Invalid JWT"});
        }

        req.username = username;
        next();
    })
}

//Starting server
app.listen(port,() => {
    console.log("Connected to server on port: " + port);
});