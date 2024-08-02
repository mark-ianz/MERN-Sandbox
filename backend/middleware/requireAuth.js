import jwt from "jsonwebtoken";
import User from "../model/UserSchema.js";

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization Token Required!" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }, "_id");
    next();
  } catch (error) {
    res.status (401).json ({error: "Request is not authorized!"})    
  }
};

export default requireAuth;
