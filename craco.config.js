const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks/')
    },
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [
            {
              from: "node_modules/@ricky0123/vad/dist/*.worklet.js",
              to: "[name][ext]",
            },
            {
              from: "node_modules/@ricky0123/vad/dist/*.onnx",
              to: "[name][ext]",
            },
            { from: "node_modules/onnxruntime-web/dist/*.wasm", to: "[name][ext]" },
          ],
        }),
      ],
    },
  },
};