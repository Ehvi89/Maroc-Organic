const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVGRlaG9oZmFhaGMgdWhhZXV1aWdyaWdhZXlmZ3llamZhYmtqZmlhdmhlY3Zhamh2amRndnhhdmtqaHZmZXlmdmFqa2FlY3ZldXZja3FoY2IgcWdmdXFlZnZhaHZicWhwYXY4NDY1NDY1NGU2ZjQ2cTRlZjZmZWdxNno2Z3pyaDZxaHF6NjQ2cTU0djMifQ.eyJzdWIiOiIxMjM0NTg3Njg0ODE0ODA4MDg3ZW1kKsO5bcO5c2x4a2xqZmthbGtuZmplYiBjbmVoa2FrYmZhamdoYWplbWp2YjY3ODkwIiwibmFtZSI6IkVob2x5IEFiYmxpIE1pZXNzYW4gU2FtdWVsIFZpYW5ubmV5IC0gTWFyb2MgT3JnYW5pYyIsImlhdCI6MS41MTYyMzkwMjIwMTUxODQ2ZSszM30.jzqCqaO9UHoAlUMG_uLA93DoYzr1mOPlIg1nb8fOQfM';
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};