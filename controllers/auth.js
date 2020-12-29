const User = require("../models/Users");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/autharization/tokenHelpers")


const register = asyncErrorWrapper(async (req, res, next) => {

  

    //try catch


    const {name, email, password,role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });


        sendJwtToClient(user, res);
        
    
    });
    //async, await


const tokentest = (req, res, next) => {

    res.json({
        success : true,
        message : "Welcome" 
    })

}

module.exports =  {
    register,
    tokentest
}