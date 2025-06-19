const isAdmin = (req, res, next) => {
    try {
        if(req.user.role != 'admin') {
        return res.status(403).json({msg:'Access denied: Admins Only'});
        }
        next();
    } catch (error) {
        console.error(error);        
        res.status(500).json({msg: 'Something went wrong in server'});
    }
    
}

module.exports = isAdmin