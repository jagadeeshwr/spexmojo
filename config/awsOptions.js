const dotenv = require('dotenv');
dotenv.load({path: '.env'});

let options = {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_S3_BUCKET: process.env.AWS_INPUT_BUCKET,
  s3ApiVersion: '2012–09–25',
  etApiVersion: "2012–09–25",
  s3Region: process.env.AWS_S3_REGION,
  etRegion: process.env.AWS_ET_REGION,

  etPipelineId: process.env.AWS_ET_PIPELINE_ID,
  etMp3PresetId: process.env.ET_MP3_PRESET_ID,
  etMp3PresetId_160k_S: process.env.ET_MP3_PRESETID_160K_S,
  etMp3PresetId_64k_S: process.env.ET_MP3_PRESETID_64K_S,

  generateCloudFrontUrl: function (filePath) {
    if (filePath) {
      return process.env.CDN_WEB_STATIC + '/' + filePath;
    } else {
      return '';
    }
  },
};
module.exports = options;
