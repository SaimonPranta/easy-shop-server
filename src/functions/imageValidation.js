const imageValidation = (imgArray) => {
  if (!imgArray || !imgArray.length) {
    return {
      validation: false,
      message: "Please provide some image and try again",
    };
  }
  let message;
  imgArray.forEach((img) => { 
    if (
      img.mimetype !== "image/jpg" &&
      img.mimetype !== "image/png" &&
      img.mimetype !== "image/jpeg"
    ) {
      return message = {
        validation: false,
        message: "Only .jpg .png or .jpeg format allowed !",
      };
    }
    if (img.size >= "1500012") {
      return message = { validation: false, message: "Image Size are too large !" };
    }
    return message = {
      validation: true,
    };
  });
  return message;
};

module.exports = imageValidation;
