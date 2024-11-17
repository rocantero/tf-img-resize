const imageService = require('./service/image');


/**
 * AWS Lambda handler to get a resized image.
 * 
 * This function handles the GET request to the endpoint /image/{width}x{height}/{imageName}.
 * It extracts the width, height, and image name from the URL path, and then uses the imageService
 * to get a resized version of the image. If successful, it returns the URL of the resized image.
 * If the original image does not exist, it throws an error.
 * 
 * @param {Object} event - The event object containing request data.
 * @param {string} event.path - The URL path from which width, height, and image name are extracted.
 * @param {Object} context - The context object containing runtime information.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the status code and body.
 * 
 * @throws {Error} - Throws an error if the original image does not exist.
 */

const imageService = require ('./services/image');

exports.handler = async (event, context) => {
  const { path } = event;
  const pathParts = path.split('/');
  const dimensions = pathParts[2].split('x');
  const width = parseInt(dimensions[0]);
  const height = parseInt(dimensions[1]);
  const imageFullName = pathParts[3];
  const [imageName, imageExtension] = imageFullName.split('.');

  try {
    const image = await imageService.getResized(imageName, width, height);
    return {
      statusCode: 200,
      body: JSON.stringify({ result: { link: image } }),
    };   
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Image does not exist.' }),
    };
  }
};