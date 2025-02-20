const jwt = require('jsonwebtoken');
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token =authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'access token is missing or invalid' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'token is invalid or expired' });
    }
};
module.exports = authenticateAdmin;
