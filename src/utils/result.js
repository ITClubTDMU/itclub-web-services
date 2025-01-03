export const Result = (statusCode, message, data) => {
  return {
    statusCode,
    message,
    quantity: data.length >= 0 ? data.length : 1,
    data,
  };
};
