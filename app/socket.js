function socket(app) 
{
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    
    var chatDetails = {
        users: [],
    };
    
    io.on('connection', socket => {
        socket.on("register", fn => {
            // generates a name for new client
            let assignedName = "guest-" + socket.id.substr(0, 5);
            
            // record information about the new client 
            let user = { id: socket.id, name: assignedName };
            chatDetails.users.push(user);
            
            // returns to new client, whos in the chat and assigned name
            fn({ users: chatDetails.users, name: assignedName }); 
            
            // inform all other clients of the new client 
            socket.broadcast.emit("update", chatDetails);
        });
        
        socket.on("message", (res) => {
            let { username, message } = res;
            
            // broadcast new message to other clients
            socket.broadcast.emit("message", {username, message});
        });
        
        socket.on("name change", (newName, fn) => {
            // check if name already taken
            if( chatDetails.users.some(u => u.name == newName) ) {
                fn(false);
            } else {
                let idx = chatDetails.users.findIndex( user => user.id == socket.id );
                // let oldName = chatDetails.users[idx];
                chatDetails.users[idx].name = newName;
                io.emit("update", chatDetails);
                fn(true);
            }
        });

        socket.on('disconnect', () => {
            // update clients currently in the chat
            chatDetails.users = chatDetails.users.filter( 
                user => user.id !== socket.id
            );
            
            // broadcasts to to clients about disconnecting client
            socket.broadcast.emit("update", chatDetails);
        });
    });
    
    return server;
}

module.exports = socket;
