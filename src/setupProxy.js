const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://217.28.222.68:6050', // Сервер, на который будет идти проксирование
            changeOrigin: true,
        })
    );
    // app.use(
    //     '/api',
    //     createProxyMiddleware({
    //         target: 'http://217.28.222.68:6050', // Сервер, на который будет идти проксирование
    //         changeOrigin: true,
    //     })
    // );
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://127.0.0.1:3099', // Сервер, на который будет идти проксирование
            changeOrigin: true,
        })
    );
    app.use(
        '/ws',
        createProxyMiddleware({
            target: 'http://217.28.222.68:6101',  // Адрес WebSocket сервера
            ws: true,                         // Включение поддержки WebSocket
            changeOrigin: true,
        })
    );
};


// "proxy": "http://217.28.222.68:6050"