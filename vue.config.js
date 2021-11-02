
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

let port  = 6789
module.exports = {
    publicPath: './',
    outputDir: 'dist',
    // assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
      port: port,
      open: true,
      overlay: {
        warnings: false,
        errors: false
      },
    },
    css:{
        loaderOptions:{
            sass:{
              additionalData:`@import "@/styles/color.scss";` 
            },
        }
    },
    configureWebpack: {
      name: 'H2O',
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    },
    chainWebpack: config => {
      config
        .plugin('html')
        .tap(args => {
          args[0].title= 'H2O'
          return args
        })
    },
}