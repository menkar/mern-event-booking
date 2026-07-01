const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const getEnv = (key, required = true) => {
  const value = process.env[key]?.trim();
  if (required && !value) {
    throw new Error(`${key} environment variable is required`);
  }
  return value || '';
};

const validateEnv = () => {
  getEnv('MONGODB_URI');
  getEnv('JWT_SECRET');
};

const getJwtSecret = () => getEnv('JWT_SECRET');

module.exports = {
  getEnv,
  validateEnv,
  getJwtSecret,
};
