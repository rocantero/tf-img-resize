const imageService = require('./services/image');

exports.handler = async (event, context) => {
  try {
    const images = await imageService.getAll();
    return {
      statusCode: 200,
      body: JSON.stringify({
        count: images.length,
        result: images
      }),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}