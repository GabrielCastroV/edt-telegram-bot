const http = require('node:http');

http.createServer((req, res) => {
    res.write('im alive telegram bot edt');
    res.end();
}).listen(8001);