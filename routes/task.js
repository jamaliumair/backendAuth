import Task from "../models/Task.js";
import express from "express";
import sendResponse from "../helpers/utilityFunctions.js";


const router = express.Router();

router.post("/", async (req, res) => {
    const {task} = req.body;

    let newTask = new Task({
        task,
        createdBy: req.user._id
    })

    newTask = await newTask.save();

    sendResponse(res,201,newTask,true,"Task Created")
})


router.get("/", async (req,res)=> {
    const task = await Task.find({createdBy: req.user._id});
    sendResponse(res,200,task,true,"Task found successfully")

})

export default router