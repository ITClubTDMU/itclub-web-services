const checkImageType = (images) => {
  for (const image of images) {
    if (!image.originalname.match(/\.(jpeg|jpg|gif|png)$/)) {
      return false;
    }
  }
  return true;
};

export { checkImageType };
