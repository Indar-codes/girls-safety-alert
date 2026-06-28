const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send("Access Denied");
        }

        const token = authHeader.split(" ")[1];

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;
        next();
    } catch (error) {
        console.log("JWT ERROR =",error);
        res.status(401).send("Invalid Token");
    }
};
module.exports = auth;