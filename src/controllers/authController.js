import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { userService } from "~/services/userService";
import { StatusCodes } from "~/utils/statusCodes";
import { Result } from "~/utils/result";

const handleLogin = async (req, res, next) => {
  try {
    const body = await userService.validateRequest(req.body);
    let user = await userService.findOne(
      body.username ? body.username : body.email
    );
    if (!user) {
      if (body.email) {
        user = await userService.createNew(body);
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(Result(StatusCodes.UNAUTHORIZED, "User not found"));
      }
    } else if (body.username && user.password !== body.password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(Result(StatusCodes.UNAUTHORIZED, "Password incorrect"));
    }
    // console.log(user);
    // create JWTs
    const accessToken = jwt.sign(
      { userId: user._id },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(StatusCodes.OK)
      .json(
        Result(StatusCodes.OK, "Login successful", { ...user, accessToken })
      );
  } catch (error) {
    next(error);
  }
};

const handleRegister = async (req, res, next) => {
  try {
    const body = await userService.validateRequest(req.body);
    const user = await userService.createNew(body);
    res
      .status(StatusCodes.CREATED)
      .json(Result(StatusCodes.CREATED, "User created", user));
  } catch (error) {
    next(error);
  }
};

export const authController = {
  handleLogin,
  handleRegister,
};
