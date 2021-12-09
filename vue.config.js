

module.exports = {
    transpileDependencies: [
        // 'vue-echarts',
        // 'resize-detector'
    ],
    devServer: {
        port: 8081,
        proxy: {
            '/web': {
              target: 'http://test.gzfzdev.com:5035',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/web': ''
                }
            }
        }
    },
};

