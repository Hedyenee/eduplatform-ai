const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required to use Gemini routes');
  }

  // Default to a stable, generally available model (listed by the API)
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI.getGenerativeModel({
    model: modelName,
  }, {
    // Force v1 to access current Gemini models (v1beta does not expose some)
    apiVersion: 'v1',
  });
};

module.exports = { getModel };
