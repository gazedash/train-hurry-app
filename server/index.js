var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', function(conn) {
    conn.write('n' + JSON.stringify(Math.random()));
    setInterval(function () {
        conn.write('n' + JSON.stringify(Math.random()));
    }, 12000);
    // conn.on('data', function(message) {})
    conn.on('close', function() {console.log('close')});
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(process.env.PORT || 9999, '0.0.0.0');