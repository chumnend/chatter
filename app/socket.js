function socket(app) 
{
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    var roomDetails = {
        numClients: 0,
        members: []
    };    
    
    io.on('connection', socket => {
        socket.on("assign", data => {
            roomDetails.numClients++;
            roomDetails.members.push(data.name);
            socket.broadcast.emit("alert", `${data.name} has joined the room`);
        });
        
        socket.on('typing', name => {
           socket.broadcast.emit("typing", `${name} is typing...`);
        });
        
        socket.on('chat message', msg => {
            socket.broadcast.emit("chat message", msg);
        });
        
        socket.on('disconnect', () => {
            console.log(socket.id);
            roomDetails.numClients--;
            io.emit("alert", "a user has left the room");
        });
    });
    
    return server;
}

module.exports = socket;

/*
    Show who’s online.
    Add private messaging.
*/
