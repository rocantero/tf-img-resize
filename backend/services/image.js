const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();
const BUCKET_NAME = 'my-s3-bucket';

const ORIGINAL_PREFIX = 'og/';
const RESIZED_PREFIX = 'rs/';

const getAll = async () => {
  const response = await s3.listObjectsV2({
    Bucket: BUCKET_NAME,
    Prefix: ORIGINAL_PREFIX,
  }).promise();

  const imgs = response.Contents.map(item => (`https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}`));

  return { count: imgs.length, result: imgs };
}

const getResized = async (name, width, height) => {

  const [imageName, imageExtension] = name.split('.');
  const resizedName = `${imageName}_${width}x${height}.jpeg`;

  try {
    await s3.headObject({
      Bucket: BUCKET_NAME,
      Prefix: RESIZED_PREFIX,
      Key: resizedName,
    }).promise();
  
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${RESIZED_PREFIX}${resizedName}`;
  } catch (e) {
    // TODO check if error is NotFound
    return resize(name, resizedName, width, height);
  }
  
}

const resize = async (originalName, resizedName, width, height) => {

  const originalImage = await s3.getObject({
    Bucket: BUCKET_NAME,
    Key: originalName,
  }).promise();

  // Resize the image using Sharp
  const resizedImage = await sharp(originalImage.Body)
    .resize({width: parseInt(width), height: parseInt(height), fit: sharp.fit.cover })
    .jpeg()
    .toBuffer();

  // Upload the resized image to S3
  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: resizedName,
    Prefix: RESIZED_PREFIX,
    Body: resizedImage,
  }).promise();

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${RESIZED_PREFIX}${resizedName}`;
}

const create = async (buffer, name) => {

  const isImageValid = await sharp(buffer).toBuffer().then(() => true).catch(() => false);
  
  if (!isImageValid) {
    throw new Error('Invalid image');
  }

  const [imageName, imageExtension = ''] = name.split('.');

  const uniqueImageName = `${imageName}-${uuidv4()}.${imageExtension}`;

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: uniqueImageName,
    Prefix: ORIGINAL_PREFIX,
    Body: buffer,
  }).promise();

  return { name: uniqueImageName, url: `https://${BUCKET_NAME}.s3.amazonaws.com/${ORIGINAL_PREFIX}${uniqueImageName}` };
}

module.exports = {
  getAll,
  getResized,
  create,
  resize
};