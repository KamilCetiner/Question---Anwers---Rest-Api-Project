const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/autharization/tokenHelpers")

const getAccessToRoute = (req, res, next) => {

    //Token

    const {JWT_SECRET_KEY} = process.env;

  
    if(!isTokenIncluded(req)) {

        //  401 Unauthorized
        //  403 Forbidden
        return next(new CustomError("You are not authorized to acces this route", 401)
        );


    }
    
    const accessTooken = getAccessTokenFromHeader(req);

    jwt.verify(accessTooken, JWT_SECRET_KEY, (err, decoded) => {

        if(err) {
            return next (new CustomError("Your are not authorized to access this route", 401))
        }

        console.log(decoded)
        next();

    })

    //CustomError
};

module.exports = {
    getAccessToRoute

};