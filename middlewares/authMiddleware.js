const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({msg: 'No token, not authorized'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({msg: 'Invalid token'});
    }
};

module.exports = requireAuth;