const express = require("express");
const dotenv = require("dotenv");


const router = require("./routers/index")

// Environment Variables

dotenv.config({
    path: "./config/env/config.env"
});

const app = express();
const PORT = process.env.PORT;

// Routers Middleware

app.use("/api", router)


app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});

