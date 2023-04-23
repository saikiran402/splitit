require("dotenv").config();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const db = require("../models/index");



exports.protect = async (req, res, next) => {
    try {
      if (req.headers["user-agent"].substring(0, 7).toLowerCase() != "postmann") {
        // 1) Getting token and check it's there
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
          token = req.cookies.jwt;
        }
  
        if (!token) {
          return res
            .status(401)
            .json("You are not logged in! Please log in to get access.");
        }
  
        // 2) Verification token
        const decoded = await promisify(jwt.verify)(
          token,
          'orangedooraptisthebestaptinstillwater'
        );
        if (decoded) {
          const currentUser = await db.User.findById(decoded.id);
          if (!currentUser) {
            return res
              .status(401)
              .json("The user belonging to this token no longer exist.");
          }
          // GRANT ACCESS TO PROTECTED ROUTE
          req.user = currentUser;
          res.locals.user = currentUser;
          //console.log(req.user.name);
          next();
        } else {
          return res.status(401).json("Un Authorized Please Login Again");
        }
      } else {
        return res.status(409).json({ message: "unauthorized request" });
      }
    } catch (err) {
      console.log(err.stack.split("\n")[0]);
      console.log(err.stack.split("\n")[1]);
      console.log("------------------------------------------------>");
      return res
        .status(401)
        .json({ message: "Un Authorized Please Login Again" });
    }
  };
  