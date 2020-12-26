const User = require("../models/Users")

const register = async (req, res, next) => {

    const name = "Kemal";
    const email = "kemal@gmail.com";
    const password = "123456";

    //async, await

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
};

module.exports = {
    register
}