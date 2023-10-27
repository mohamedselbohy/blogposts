const User = require('../models/user');
const { uploadSingleImage } = require('../middleware/imageUploader');

exports.uploadUserImage = uploadSingleImage('profileImg');