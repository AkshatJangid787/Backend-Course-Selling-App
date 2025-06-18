const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//signup
exports.signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({msg: 'User already exists'})
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        res.status(201).json({msg:'User Registered Successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'Server error during registration'});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
           httpOnly: true,             // prevent JS access
           secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
           sameSite: 'Strict',         // protect from CSRF (or 'Lax')
           maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            msg: 'Login Successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during login' }); 
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) return res.status(404).json({msg: 'User not found'});
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'Server error'});
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    res.json({msg: 'Logged out (if logged in)'});
};