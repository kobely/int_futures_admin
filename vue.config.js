const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  css: [],
  js: [
    'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
    'https://cdn.bootcss.com/vue-router/3.1.6/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
    'https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js',
    'https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js'
  ]
}

module.exports = {
  chainWebpack: config => {
    if (isProduction) {
      // 移除preload、prefetch插件
      // config.plugins.delete('preload')
      config.plugins.delete('prefetch')

      // 分割代码
      config.optimization.splitChunks({
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            enforce: true
          },
          common: {
            chunks: 'all',
            minChunks: 2, // 模块的最小被引用次数
            priority: -20,
            enforce: true, //强制生成
            minSize: 30000, // 形成一个新代码块最小的体积
            reuseExistingChunk: true // 允许在模块完全匹配时重用现有的块，而不是创建新的块。
          }
        }
      })

      // 只引入我们需要的Antd中要的Icon文件,需要手动导入，也可以使用插件实现，参考 https://www.cnblogs.com/fulu/p/13255538.html
      config.resolve.alias.set('@ant-design/icons/lib/dist$', path.resolve(__dirname, 'src/utils/antdIcons.js'))

      // 代码压缩优化
      config.optimization.minimize(true)
      // config.optimization.minimizer = [new UglifyJsPlugin()]

      // 注入cdn
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })

      // 打包文件哈希化
      config.output.filename('[name].[hash:8].js').end();
    }

    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 优化打包体积，使用cdn
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        moment: 'moment',
        lodash: '_'
      }

      // gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  },
  css: {
    sourceMap: false //是否为 CSS 开启 source map，false将提高构建速度,默认false
  },
  lintOnSave: false, //是否开启eslint检测，有效值：ture | false | 'error'
  productionSourceMap: false, //是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  // 指定对第三方组件进行babel-polyfill处理
  transpileDependencies: ['_ant-design-vue@1.5.1@ant-design-vue', 'ant-design-vue'],
  devServer: {
    port: 8090,
    // proxy: {
    //   '/api': {
    //     //target: process.env.VUE_APP_API_BASE_URL, // 测试环境
    //     target: 'http://172.16.55.101:8088',
    //     ws: true,
    //     changeOrigin: true
    //   }
    // },
    overlay: {
      warnings: false,
      errors: true
    }
  },
  parallel: require('os').cpus().length > 1 // 构建时开启多进程处理 babel 编译
}
