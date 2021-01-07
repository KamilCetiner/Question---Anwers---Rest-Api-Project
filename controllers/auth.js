const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/autharization/tokenHelpers")
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const User = require("../models/User");
const sendEmail = require('../helpers/libraries/sendEmail')


const register = asyncErrorWrapper(async (req, res, next) => {

  

    //try catch


    const {name, email, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        }); resetPassword

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

// Logout olmak icin hem cookies den hem de envurironment den access token imizi silmek gerekecek 

const logout = asyncErrorWrapper(async (req, res, next) => {

    const {NODE_ENV} = process.env;

    return res.status(200).cookie({

        httpOnly : true,
        expires : new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        succes : true,
        message : "Logout Successful"
    });


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

const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    // Image Upload Success

    res.status(200)
    .json({

        succes : true,
        message : "Image Upload Successfull"
    })


});

// Forgot Password(Ilk önce User icerisinde getResetPasswordTokenFromUser fonksiyonunu olusturduk)

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {

    const resetEmail = req.body.email;

    const user = await User.findOne({email : resetEmail});

    if (!user) {
        return next(new CustomError('There is no user with that e mail', 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser(); 

    await user.save();


    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `

    <h3> Reset Your Password</h3>
    <p>This <a href = '${resetPasswordUrl}' target= '_blank'> link </a> will expire in 1 hour </p>
    `;

    try {

        await sendEmail({

            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset your Password",
            html : emailTemplate
        })

        return res.status(200).json({
        success: true,
        message : "Token sent to Your Email"

        })
    }

    catch (err) {
        console.log(err)

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError("Email Could Not Be Sent", 500))

    }
    
});


module.exports =  {
    register,
    getUser,
    logout,
    login,
    imageUpload,
    forgotPassword
}