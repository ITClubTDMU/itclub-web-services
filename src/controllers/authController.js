import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import fsPromises from "fs/promises";
import path from "path";
import { userService } from "~/services/userService";
import { StatusCodes } from "~/utils/statusCodes";
import { Result } from "~/utils/result";

const handleLogin = async (req, res, next) => {
  try {
    const body = await userService.validateRequest(req.body);
    const user = await userService.findOne(
      body.username ? body.username : body.email
    );
    console.log(user);
    // create JWTs
    const accessToken = jwt.sign(
      { userId: user._id },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await userService.updateOne(user.username ? user.username : user.email, {
      refreshToken,
    });
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(await userService.findAll())
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res
      .status(StatusCodes.OK)
      .json(Result(StatusCodes.OK, "Login successful", { accessToken }));
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(StatusCodes.NO_CONTENT);
    }
    const refreshToken = cookies.jwt;
    const user = await userService.findOne(refreshToken);
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(StatusCodes.NO_CONTENT);
    }

    await userService.updateOne(user.username ? user.username : user.email, {
      refreshToken: "?",
    });
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(await userService.findAll())
    );

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const authController = {
  handleLogin,
  handleLogout,
};
