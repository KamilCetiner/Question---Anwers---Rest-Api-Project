const User = require("../models/Users");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const register = asyncErrorWrapper(async (req, res, next) => {

    const name = "Keml";
    const email = "keml@gmail.com";
    const password = "";

    //try catch

        const user = await User.create({
            name,
            email,
            password
        });
    
        res
        .status(200)
        .json({
            success : true,
            data : user
        })
    }
);
    //async, await

    

const errorTest = (req, res, next) => {


      return next(new TypeError("Type Error", 400))
}
module.exports =  {
    register, 
    errorTest
}