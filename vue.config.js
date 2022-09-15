const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      filename: 'js/weather-app.min.js',
      chunkFilename: 'js/weather-app.min.js',
    },
    optimization: {
      splitChunks: false
    }
  },
  productionSourceMap: false,
  filenameHashing: false,
})
