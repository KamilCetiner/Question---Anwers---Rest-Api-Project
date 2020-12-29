const User = require("../models/Users");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const register = asyncErrorWrapper(async (req, res, next) => {

  

    //try catch


    const {name, email, password,role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
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