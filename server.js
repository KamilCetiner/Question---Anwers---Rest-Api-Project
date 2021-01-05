const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");

const path = require("path");


const router = require("./routers/index")

// Environment Variables

dotenv.config({
    path: "./config/env/config.env"
});

// MogoDB Connection

connectDB();


const app = express();

// Express -Body Middleware

app.use(express.json());





const PORT = process.env.PORT;

// Routers Middleware

app.use("/api", router)

// Error Handler

app.use(customErrorHandler);



// Html dosyasi Public in altinda oldugu icin dirname ile public i birlestirdik


app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
    console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});

