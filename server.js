const app = require("./app");
const config = require("./config");
const port = config.PORT || 3000;

// start the server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

server.listen(port, () => {
    console.log("Server started on port", port);
});
