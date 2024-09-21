const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',  // Проксирование всех запросов, которые начинаются с /api
        createProxyMiddleware({
            target: 'http://217.28.222.68:6050',  // Сервер backend
            changeOrigin: true,
        })
    );
};
