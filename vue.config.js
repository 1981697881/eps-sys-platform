

module.exports = {
    transpileDependencies: [
        // 'vue-echarts',
        // 'resize-detector'
    ],
    devServer: {
        port: 8081,
        proxy: {
            '/xinshuida': {
              target: 'http://epssys.kuyuntech.com:50025/xinshuida',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/xinshuida': ''
                }
            }
        }
    },
};

