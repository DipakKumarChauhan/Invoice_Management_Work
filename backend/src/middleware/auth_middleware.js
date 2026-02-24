const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authMiddleware = (req, res, next) => {
    const header =  req.headers.authorization;

    if(!header){
        return res.status(401).json({message: 'Unauthorized'});
    }

    const token = header.split(" ")[1];

    try {
        const decoded =  jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }

}

module.exports = authMiddleware;