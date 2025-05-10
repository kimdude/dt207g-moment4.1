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

//Starting server
app.listen(port,() => {
    console.log("Connected to server on port: " + port);
});