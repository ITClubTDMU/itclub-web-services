export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";

export const validateData = async (collectionSchema, data) => {
  try {
    return await collectionSchema.validateAsync(data, {
      abortEarly: false,
    });
  } catch (error) {
    throw new Error(error);
  }
};
