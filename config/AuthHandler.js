const jwt = require("jsonwebtoken");
const User = require('../models').User
exports.authenticateJWT = function (force = true) {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    let authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, secretOrKey, async function (err, jwt_payload) {
        if (err) {
          customErrorLogger(err);
          return res.sendStatus(401);
        } else {
          if (jwt_payload && jwt_payload.id) {
            let existingUser = await User.findOne({
              where: {
                id: jwt_payload.id,
                status: "active"
              }
            });
            if (existingUser) {
              req.authenticated = true;
              req.user = existingUser;
              next();
            } else {
              return res.sendStatus(401);
            }

          } else if (!force) {
            next();
          } else {
            return res.sendStatus(403);
          }
        }
      });
    } else if (!force) {
      next();
    } else {
      return res.sendStatus(401);
    }
  };
};
