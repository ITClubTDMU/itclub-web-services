export const Result = (statusCode, message, data) => {
  return {
    statusCode,
    message,
    quantity: data.length ? data.length : 1,
    data,
  };
};
