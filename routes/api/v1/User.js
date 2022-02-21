const express = require('express');

const router = express.Router();

let awsOptions = require('../../../config/awsOptions');

const multer = require('multer');
const multerS3 = require('multer-s3');

const AWS = require('aws-sdk');

let accessKeyId = awsOptions.AWS_ACCESS_KEY;
let secretAccessKey = awsOptions.AWS_SECRET_KEY;
let s3Bucket = awsOptions.AWS_S3_BUCKET;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: awsOptions.s3Region
});

let s3 = new AWS.S3();

// Profile Pic upload
let postCloudStorage = multerS3({
    s3: s3,
    bucket: s3Bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (request, file, ab_callback) {
        ab_callback(null, {fieldname: file.fieldname});
    },
    key: function (request, file, ab_callback) {
        let newFileName = Date.now() + '-' + file.originalname;
        let fullPath = 'post/' + newFileName;
        ab_callback(null, fullPath);
    },
});

let postUpload = multer({
    storage: postCloudStorage
});

let AuthHandler = require('../../../config/AuthHandler');
const userControl = require('../../../controllers/api/v1/User');
router.post('/user-login', userControl.sendOtp);
router.post('/forgot-password', userControl.verifyOtp);
router.get('/profile',AuthHandler.authenticateJWT(),userControl.userGetProfile);
router.get('/admin/:userId',AuthHandler.authenticateJWT(),userControl.AdminGetUserProfile)



module.exports = router;

