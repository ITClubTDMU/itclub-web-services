import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { userService } from "~/services/userService";
import { Result } from "~/utils/result";
import { StatusCodes } from "~/utils/statusCodes";

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
    const refreshToken = cookies.jwt;
    const user = await userService.findOne(refreshToken);
    if (!user) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      console.log(user, decoded);
      if (err || user._id.toString() !== decoded.userId) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
      const accessToken = jwt.sign(
        { userId: user._id },
        env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res
        .status(StatusCodes.OK)
        .json(
          Result(StatusCodes.OK, "Refresh token successful", { accessToken })
        );
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = {
  handleRefreshToken,
};
