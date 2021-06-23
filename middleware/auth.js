const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) { // checking authorization
        return res.status(401).json({ msg: 'No token founded, Autghorization denied' });
    }
    try { //verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }catch(err) {
        req.status(401).json({ msg: 'Token is not valid' });
    } 
}