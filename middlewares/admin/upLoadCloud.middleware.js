const streamUpload = require("../../helpers/streamUpload.helper");

module.exports.uploadSingle =async (req  , res , next) => {
  if (req.file) {

      let result = await streamUpload(req.file.buffer);
      req.body[req.file.fieldname] = result.url;

      next();
  } else {  
    next();
  }
}



