const minimist = require('minimist')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const WriteAssetsPlugin = require('./build/plugins/WriteAssets')
const packageData = require('./package.json')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const cdnDependencies = require('./dependencies-cdn')
const { chain, set, each } = require('lodash')

// 参数
const argv = minimist(process.argv.slice(2))

// 增加环境变量
process.env.VUE_APP_VERSION = packageData.version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')
const [, v] = String(argv.version || packageData.version).match(/^.*?((\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?(?:\+([0-9A-Za-z-.]+))?).*?$/) || []
process.env.VUE_APP_VERSION = v || argv.version || packageData.version

// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 设置不参与构建的库
const externals = {}
cdnDependencies.forEach(pkg => { externals[pkg.name] = pkg.library })

// 引入文件的 cdn 链接
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e)
}

const pages = {
  index: {
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'index.html',
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  },
  orgMap: {
    entry: 'src/entry/orgMap/main.js',
    template: 'public/orgMap.html',
    filename: 'orgMap.html',
    chunks: ['chunk-vendors', 'chunk-common', 'orgMap']
  },
  orgGraph: {
    entry: 'src/entry/orgGraph/main.js',
    template: 'public/orgGraph.html',
    filename: 'orgGraph.html',
    chunks: ['chunk-vendors', 'chunk-common', 'orgGraph']
  }
}

// 本地开发代理配置的代理 VUE_APP_API_BASE_URL_DEV_PROXY_TARGET = https://yapi.dreamkey.cn/mock/82/business
let proxy
if (process.env.NODE_ENV === 'development') {
  if (process.env.VUE_APP_API_BASE_URL_DEV_PROXY_TARGET && process.env.VUE_APP_API_BASE_URL) {
    proxy = {
      [process.env.VUE_APP_API_BASE_URL]: {
        target: process.env.VUE_APP_API_BASE_URL_DEV_PROXY_TARGET, // 代理地址
        changeOrigin: true, // 接口跨域
        secure: true,
        onProxyReq (proxyReq, req, res, options) {
          if (req.body) {
            const bodyData = JSON.stringify(req.body)
            proxyReq.setHeader('Content-Type', 'application/json')
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
            proxyReq.write(bodyData)
          }
        }
      }
    }
  }
}

module.exports = {
  publicPath,
  lintOnSave: true,
  devServer: {
    publicPath, // 和 publicPath 保持一致
    disableHostCheck: process.env.NODE_ENV === 'development', // 关闭 host check，方便使用 ngrok 之类的内网转发工具
    before: process.env.VUE_APP_MODE === 'mock' && require('./mock/mock-server.js'),
    proxy: proxy
  },
  css: {
    extract: true,
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/common/var.scss";',
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  },
  pages: pages,
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.externals = externals
      configNew.plugins = [
        // 编译打包后生成 package.json 文件
        new WriteAssetsPlugin({
          path: 'package.json',
          content: JSON.stringify({
            name: packageData.name + '-dist',
            version: process.env.VUE_APP_VERSION
          })
        }),
        // gzip
        new CompressionWebpackPlugin({
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    return configNew
  },
  chainWebpack: config => {
    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中
     * 已适配多页
     */
    const htmlPluginNames = chain(pages).keys().map(page => 'html-' + page).value()
    const targetHtmlPluginNames = htmlPluginNames.length ? htmlPluginNames : ['html']
    each(targetHtmlPluginNames, name => {
      config.plugin(name).tap(options => {
        // set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : [])
        set(options, '[0].cdn', cdn)
        return options
      })
    })

    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    for (const name of Object.keys(pages)) {
      config.plugins
        .delete(`prefetch-${name}`)
        .delete(`preload-${name}`)
    }

    config.resolve
      .symlinks(true)

    // 主題
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'style/theme-colors.[contenthash:8].css',
        matchColors: [...forElementUI.getElementUISeries(process.env.VUE_APP_THEME_COLOR)], // 主色
        changeSelector: forElementUI.changeSelector
      }])

    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // 不输出 map 文件
  productionSourceMap: false
}
