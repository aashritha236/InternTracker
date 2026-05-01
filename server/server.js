const express = require("express");
const mongoose = require("mongoose");
const app = express();

//middleware
app.use(express.json());

//test route
app.get("/",(req,res) => {
    res.send("Server is running");
});

//start server
app.listen(5000,() => {
    console.log("Server running on port 5000");
});

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));