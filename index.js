const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require('./routes/courseRoutes');

dotenv.config();

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use('/uploads', express.static('uploads'));


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server Started on Port ${PORT}`);
})