import { env } from "~/config/environment";
import { StatusCodes } from "~/utils/statusCodes";
import { Result } from "~/utils/result";
import nodemailer from "nodemailer";
import ApiError from "~/utils/ApiError";

const transporter = nodemailer.createTransport({
  service: env.SERVICE_EMAIL,
  auth: {
    user: env.USER_AUTH,
    pass: env.PASS_AUTH,
  },
});

const validateSendMailRequest = (reqBody) => {
  const { recipients, subject, htmlContent } = reqBody;
  if (!recipients) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Recipients are required");
  } else if (!subject) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Subject is required");
  } else if (!htmlContent) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "HtmlContent is required");
  }
};

const sendEmail = async (req, res, next) => {
  try {
    const { recipients, subject, htmlContent } = req.body;
    const sender = `Câu lạc bộ IT <${env.USER_AUTH}>`;

    // Validate the request
    validateSendMailRequest(req.body);

    // Configure the mail options object
    const options = {
      from: sender,
      to: recipients.join(", "),
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    transporter.sendMail(options, async function (error, info) {
      if (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
      }
      res
        .status(StatusCodes.CREATED)
        .send(Result(StatusCodes.CREATED, "Email sent", info));
    });
  } catch (error) {
    next(error);
  }
};

export { sendEmail };
