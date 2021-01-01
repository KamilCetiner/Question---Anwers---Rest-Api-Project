const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/autharization/tokenHelpers")
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const User = require("../models/User");


const register = asyncErrorWrapper(async (req, res, next) => {

  

    //try catch


    const {name, email, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendJwtToClient(user, res);
        
    
    });
    //async, await

const login = asyncErrorWrapper(async (req, res, next) => {

    const {email, password} = req.body;

    if (!validateUserInput(email, password)) {
        
        return next(new CustomError("Please check your inputs", 400));
    } 



    const user = await User.findOne({email}).select("+password") ;

    //password ü karsilastirma

    if(!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400));
    }

    sendJwtToClient(user, res);

    res.status(200)
    .json({
        success : true
    })

});


const getUser = (req, res, next) => {

    res.json({
        success : true,
        data : {

        id : req.user.id,
        name : req.user.name

        } 
    });

};



module.exports =  {
    register,
    getUser,
    login
}