const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/netflix-project/',
  devServer: {
    host: process.env.IP_ADDRESS || 'localhost', // .env 파일의 IP_ADDRESS 사용
    port: process.env.PORT || 8080, // .env 파일의 PORT 사용
  },
})