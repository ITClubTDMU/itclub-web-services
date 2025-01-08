import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "~/utils/statusCodes";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  // console.log(authHeader); // Bearer <token>
  const token = authHeader.split(" ")[1];
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden - invalid token
    }
    req.user = decoded.userId;
    next();
  });
};
