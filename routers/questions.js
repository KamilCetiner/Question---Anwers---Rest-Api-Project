const express = require("express");
const {getAllQUestions} = require("../controllers/questions")

//api/questions

const router = express.Router();

router.get("/", getAllQUestions);


module.exports = router;