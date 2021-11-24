module.exports = {
  chainWebpack: (config) => {
    // 修改html插件的标题（网页标题）
    config.plugin('html').tap((args) => {
      args[0].title = '起始页'
      return args
    })
  },
  lintOnSave: false,
}
