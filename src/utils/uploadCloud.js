const AWS = require('aws-sdk');
const mime = require('mime-types');
const config = require("../config/config");
const ApiError = require('./apiError');
const httpStatus = require('http-status');

const uploadCloud = async (Key,Body,Bucket = 'facesync', ACL = 'public-read') => {
  const ContentType = mime.lookup(Key) || 'application/octet-stream';
  const params = {
    Bucket,
    Key: `/EOD-management/${Key}`,
    Body:Body.buffer,
    ACL,
    ContentType
  };
  // console.log(params)
  const spacesEndpoint = new AWS.Endpoint(config.cloudCred.awsEndPoint);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    useAccelerateEndpoint: false,
    s3ForcePathStyle: false,
    credentials: new AWS.Credentials(config.cloudCred.accessKeyId, config.cloudCred.secretAccessKey),
  });
  
    try {
      // params.ContentType = mime.lookup(params.Key) || 'application/octet-stream';
  
      const uploadedData = await s3.upload(params).promise();
      return uploadedData.Location || "";
    } catch (error) {
      console.error("Error uploading the image to cloud:", error.message);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error uploading the image, try again"
      );
    }
  };

module.exports = uploadCloud;