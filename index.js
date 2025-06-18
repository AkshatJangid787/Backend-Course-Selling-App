const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

// app.get("/", (req, res)=>{
//     res.send("Course Selling API Running");
// })
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server Started on Port ${PORT}`);
})