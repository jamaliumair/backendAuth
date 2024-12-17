import express from "express";
import sendResponse from "../helpers/utilityFunctions.js";
import User from "../models/User.js";
import 'dotenv/config'
import Joi from 'joi';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const router = express.Router();

const registerSchema = Joi.object({
    fullname: Joi.string().min(5).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    city: Joi.string().optional().allow(""),
    country: Joi.string().optional().allow("")

})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})


router.post("/register",async (req,res) => {
    const {error, value} = registerSchema.validate(req.body);

    if (error) return sendResponse(res,400,error.message,true,null);

    const user = await User.findOne({email: value.email});

    if (user) return sendResponse(res,403,"User already exist",true,null);

    const hashPassword = await bcrypt.hash(value.password, 10);
    value.password = hashPassword

    delete value.password

    let newUser = new User({... value});
    newUser = await newUser.save();

    sendResponse(res,201,"User Registered successfully",false,newUser);
})


router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, null, true, error.message)

    const user = await User.findOne({ email: value.email }).lean()
    if (!user) return sendResponse(res, 403, null, true, 'User is not Registered.')

        console.log(user.password, "value:", value.password)
    if(!user.password) return sendResponse(res, 403, null, true, 'Password is missing.')

    const isPasswordValid = bcrypt.compare(value.password, user.password)
    if (!isPasswordValid) return sendResponse(res, 403, null, true, 'Invalid Credentials')

    delete user.password
   console.log(user)
    var token = jwt.sign({ ...user }, process.env.AUTH_SECRET ,);

    sendResponse(res, 200, {
        user,
        token
    }, false, 'User Login Successfully')
})

export default router