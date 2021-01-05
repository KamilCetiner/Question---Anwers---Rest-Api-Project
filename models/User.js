const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type : String,
        required : [true, "Please provide a name"]
    },
    email : {
        type : String,
        required  :[true, "Please Provide an e mail" ],
        unique : true,
        match : [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]
    },
    role : {
        type : String,
        default : "user",
        enum : ["user", "admin"]
    },

    password : {
        type : String,
        minlength : [6, "Please provide a password with min length : 6"],
        required : [true, "Please provide a password"],
        select : false

    },
    createdAt : {
        type: Date,
        default : Date.now
    },
    title : {
        type: String,
    },
    about : {
        type : String,
    },
    place : {
        type: String,
    },
    website : {
        type: String,
    },
    profile_image: {
        tpye: String,
        
    },
    blocked : {
        type: Boolean,
        default : false
    },

    resetPasswordToken : {
        type: String
    },
    resetPasswordExpire : {
        type: Date

    }
})

// UserSchema Method

UserSchema.methods.generateJwtFromUser = function(){

    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        id : this._id,
        name : this.name,

    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });

    return token;
}

// Password yanlis olunca 15 bytlik bir deger dönüyor. Bu dönen degeri ile token olusturuluyor.

UserSchema.methods.getResetPasswordTokenFromUser = function() {
    const randomHexString = crypto.randomBytes(15).toString("hex");

    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto

    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex")

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)

    

}


// Kaydedilmeden önce Hooks Middleware kullaniliyor. Passwordu  hashlemek icin. npm install bcrypt kullandik

UserSchema.pre("save", function(next){

    // Parola degismediyse

    if(!this.isModified("password")) {
        next();
 
    }


    bcrypt.genSalt(10, (err, salt) => {

        if(err) next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash;
            next()
        });
    });
    
})

module.exports = mongoose.model("User", UserSchema);