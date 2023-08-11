const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  //Make sure token exists

  if (!token) {
    return next(new ErrorResponse("Unauthorized access", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorized access", 401));
  }
});

//Grant access based on roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User with role ${req.user.role} is not authorized for this role`,
          403
        )
      );
    }
    next();
  };
};
