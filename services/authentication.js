const jwt = require("jsonwebtoken");

const secret = "lsdjfljsdlfjsldjflsd";

const createToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImage: user.profileImage,
    role: user.role,
  };
  const token = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });

  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

module.exports = { createToken, validateToken };
