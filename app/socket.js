function socketWrapper(app) 
{
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    
    io.on('connection', socket => {
        console.log('a user connected');

        socket.on('chat message', msg => {
            io.emit('chat message', msg);
        });
    
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });
    
    return server;
}

module.exports = socketWrapper;
