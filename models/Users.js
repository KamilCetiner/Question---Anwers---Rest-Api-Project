const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


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
    }
})

// UserSchema Method

UserSchema.methods.generateJwtFromUser = () => {

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