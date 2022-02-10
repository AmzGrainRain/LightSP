module.exports = {
  publicPath: './',
  chainWebpack: config => { // 修改html插件的标题（网页标题）
    config.plugin('html').tap(args => {
      args[0].title = 'LightSP - 轻起始页'
      return args
    })
  },
  productionSourceMap: false // Build时不生成map文件
  // devServer: {
  //   disableHostCheck: true, // 允许外网访问dev服务器
  //   proxy: { // 代理规则
  //     '/api/': {
  //       target: 'https://www.baidu.com/sugrec'
  //     }
  //   }
  // }
}
