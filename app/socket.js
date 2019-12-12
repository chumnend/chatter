function socket(app) 
{
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    var chatDetails = {
        users: [],
        typing: []
    };

    function lookupUser(socket) {
        let idx = chatDetails.users.findIndex( 
                user => user.id == socket.id 
            );

        return { 
            idx,
            user: chatDetails.users[idx]
        };
    }

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
            socket.broadcast.emit("alert", `${assignedName} has joined the room`);
            socket.broadcast.emit("update", chatDetails);
        });

        socket.on("message", (res) => {
            let { sender, message } = res;
            
            // broadcast new message to other clients
            socket.broadcast.emit("message", { sender, message });
        });

        socket.on("private message", (res) => {
            let { sender, reciever, message } = res;
            
            // lookup socket id
            let targetUser = chatDetails.users.find(
                user => user.name  === reciever
            );
            
            if(targetUser) {
                // broadcast new message intended reciever
                io.to(targetUser.id).emit("private message", { sender, message });
            }
            else {
                socket.emit("alert", `${reciever} is not a valid user`);
            }
        });

        socket.on("name change", (newName, fn) => {
            // check if name already taken
            if( chatDetails.users.some(u => u.name == newName) ) {
                fn(false);
            } else {
                let { user } = lookupUser(socket);
                
                let oldName = user.name; 
                user.name = newName;
                
                io.emit("alert", `${oldName} changed name to ${newName}`);
                io.emit("update", chatDetails);
                fn(true);
            }
        });
        
        socket.on("start typing", () => {
            let { user } = lookupUser(socket);
            
            chatDetails.typing.push(user.name);
            
            socket.broadcast.emit("update", chatDetails);
        });
        
        socket.on("stop typing", () => {
            let { user } = lookupUser(socket);
            
            chatDetails.typing = chatDetails.typing.filter( t => {
                t !== user.name;
            });
            
            socket.broadcast.emit("update", chatDetails);
        });

        socket.on('disconnect', () => {
            let { user } = lookupUser(socket);

            // update clients currently in the chat
            chatDetails.users = chatDetails.users.filter( 
                user => user.id !== socket.id
            );

            // broadcasts to to clients about disconnecting client
            io.emit("alert", `${user.name} has left the room`);
            socket.broadcast.emit("update", chatDetails);
        });
    });

    return server;
}

module.exports = socket;
