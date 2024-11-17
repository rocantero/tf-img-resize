/**
 * AWS Lambda handler to process image upload.
 * 
 * This service receives an image file and returns an object with "name" as the image name 
 * and "url" as the S3 bucket URL.
 * 
 * @param {Object} event - The event object containing the request data.
 * @param {Object} context - The context object containing runtime information.
 * @returns {Promise<Object>} - A promise that resolves to the response object.
 * @property {number} statusCode - The HTTP status code of the response.
 * @property {string} body - The JSON stringified response body.
 */


const imageService = require('./services/image');

exports.handler = async (event, context) => {
  const { imageBuffer, imageName } = JSON.parse(event.body);

  const uniqueImageName = `${imageName.split('.')[0]}-${uuidv4()}.${imageName.split('.')[1]}`;

  try {   
    const savedImage = await imageService.create(imageBuffer, uniqueImageName);

    return {
      statusCode: 200,
      body: JSON.stringify(savedImage),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Error' }),
    };
  }
};