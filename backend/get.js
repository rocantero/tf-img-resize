/**
 * AWS Lambda handler to get a resized image.
 * 
 * This function handles the GET request to the endpoint /image/{dimensions}/{imageName}.
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
  console.log('[GET /images/{dimensions}/{imageName}] - Path:', path);
  const pathParts = path.split('/');
  const dimensions = pathParts[2];
  const [width, height] = dimensions.split('x').map(Number);
  const imageName = pathParts[3];
  console.log(`[getResizedImage] Serve resized image: ${imageName} at ${width}px width and ${height}px height)`);

  try {
    const image = await imageService.getResized(imageName, width, height);
    return {
      statusCode: 200,
      body: JSON.stringify({ result: { url: image } }),
    };   
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message || 'Image does not exist.' }),
    };
  }
};