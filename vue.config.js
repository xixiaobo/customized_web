module.exports = {
    // runtimeCompiler: true,
    // publicPath: '/', // 设置打包文件相对路径
    devServer: {
        // open: process.platform === 'darwin',
        // host: 'localhost',
        host: '0.0.0.0',
        port: 8080,
        // open: true, //配置自动启动浏览器
        proxy: {
            '/api': {
                target: 'http://39.106.141.224:8081/', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // chainWebpack: config=>{
    //     config.module.rules('iview').test(/iview.src.*?js$/).use('babel').loader('babel-loader').end()
    // }
    transpileDependencies: [
        'iview',
        'axios'
    ],
}
