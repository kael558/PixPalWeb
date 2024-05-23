const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks/')
    }
  }
};
