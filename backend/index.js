/**
 * AWS Lambda function to resize an image.
 * 
 * This function receives an image via a POST request and returns a smaller image
 * based on the dimensions provided by the parameters "width" and "height".
 * The image is always cropped to the center.
 * 
 * @param {Object} event - The event object containing the request data.
 * @param {Object} event.body - The body of the POST request.
 * @param {string} event.body.image - The base64 encoded image to be resized.
 * @param {number} event.body.width - The desired width of the resized image.
 * @param {number} event.body.height - The desired height of the resized image.
 * 
 * @returns {Object} - The response object containing the resized image.
 * @returns {number} response.statusCode - The HTTP status code.
 * @returns {Object} response.headers - The HTTP headers.
 * @returns {string} response.headers.Content-Type - The content type of the response.
 * @returns {Object} response.body - The body of the response.
 * @returns {string} response.body.message - The base64 encoded resized image.
 */


module.exports.handler = async (event) => {

  // TODO implement image resizing

  console.log('Event: ', event);
  let responseMessage = 'Hello, World!';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  }
}
