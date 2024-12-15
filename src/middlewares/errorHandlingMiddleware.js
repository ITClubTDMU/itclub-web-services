

export const errorHandlingMiddleware = (err, req, res, next) => {
  if(!err.statusCode) err.statusCode = 500;


  const resError = {
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack
  }

  console.log(resError);


  res.status(resError.statusCode).json(resError)
}