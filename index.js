import express from "express";
import userRoutes from './routes/user.js'
import authRoutes from './routes/authRoutes.js'
import authenticateuser from './middleware/authenticateuser.js'
import taskRoutes from './routes/task.js'
import mongoose from "mongoose";
import 'dotenv/config'


const app = express();
const PORT = 4000;
app.use(express.json()); 
//connect to database

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err))

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/task',authenticateuser, taskRoutes)


app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));