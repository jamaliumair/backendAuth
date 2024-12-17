import sendResponse from "../helpers/utilityFunctions.js";

import User from "../models/User.js";
import 'dotenv/config'
import jwt from 'jsonwebtoken'




async function authenticateuser(req, res, next) {
    console.log(req?.headers?.authorization);

    const bearer = req?.headers?.authorization;
    if (!bearer) return sendResponse(res, 403, null, true, "Token not provided")

    let token = bearer.split(" ")[1];
    const decoded = jwt.verify(token, process.env.AUTH_SECRET)
    if(decoded) {
        const user = await User.findById(decoded._id)
        if(user) {
            req.user = user;
            next()
        }else {
            sendResponse(res, 403, null, true, "User not found");
        }
    }else {
        sendResponse(res, 403, null, true, "Invalid token")
    }


}


export default authenticateuser