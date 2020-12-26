const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./helpers/database/connectDatabase")


const router = require("./routers/index")

// Environment Variables

dotenv.config({
    path: "./config/env/config.env"
});

// MogoDB Connection

connectDB();


const app = express();
const PORT = process.env.PORT;

// Routers Middleware

app.use("/api", router)


app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});

