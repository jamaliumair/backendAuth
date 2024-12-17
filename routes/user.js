import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async(req,res) => {
    let users = await User.find();
    res.status(200).json({
        msg: "User fetched successfully",
        error: false,
        data: users
    })
})

router.post("/", async(req,res) => {
    const {fullname, email} = req.body;
    let newUser = new User({
        fullname,
        email
    })
    newUser = await newUser.save();

    res.status(201).json({
        msg: "User added successfully",
        error: false,
        data: newUser
    })
})


router.get("/:id", async(req,res) => {
    let user = await User.findById(req.params.id);
    if(!user) {
        res.status(400).json({
            msg: "User not found successfully",
            error: false,
            data: user
        })
    }else {
        res.status(200).json({
            msg: "User fetched successfully",
            error: false,
            data: user
        })
    }
})


router.put("/:id", async(req,res) => {
    try {
        const { fullname, email } = req.body
        const user = await User.findById(req.params.id)
        let users= await User.find();

        if(!user) return res.status(400).json({
                msg: "User not found",
                error: false,
                data: user
            })
    
        if (fullname) user.fullname = fullname;
        if (email) user.email= email;
        
        await user.save();

        res.status(200).json({
            msg: "User updated successfully",
            error: false,
            data: users
        })
    }
    catch {
        res.status(500).json({
            msg: "Something Went Wrong",
            error: true,
            data: null
    })
   
}});


router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        let users = await User.find();

        if (!user) {
            return res.status(400).json({
                msg: "User not found",
                error: false,
                data: null
            });
        }

        // await User.deleteOne({ _id: req.params.id }); // Delete the user
        // await user.deleteOne();  Delete the user
        // await User.deleteOne();  Delete the user
        // You can also use User.findByIdAndDelete(req.params.id) to achieve the same.
        await User.findByIdAndDelete(req.params.id);


        // Fetch the updated list of users after deletion
        users = await User.find();

        res.status(200).json({
            msg: "User deleted successfully",
            error: false,
            data: users
        });
    } catch(err) {
        console.error("Error during deletion:", err);
        res.status(500).json({
            msg: "Something Went Wrong",
            error: true,
            data: null
        });
    }
});



export default router