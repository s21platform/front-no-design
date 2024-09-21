const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'https://api.space-21.ru',
            changeOrigin: true,
            logLevel: 'debug'
        })
    );
};