const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://217.28.222.68:6050',
            changeOrigin: true,
            logLevel: 'debug'
        })
    );
};