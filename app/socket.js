function socket(app) 
{
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    
    var chatDetails = {
        users: [],
    };
    
    io.on('connection', socket => {
        console.log("a user has connected");
        
        socket.on("register", fn => {
            let assignedName = "user-" + socket.id.substr(0, 5);
            let user = { id: socket.id, name: assignedName };
            
            chatDetails.users.push(user);
            
            fn({ users: chatDetails.users, name: assignedName }); 
        
            socket.broadcast.emit("update", chatDetails);
            
            console.log(`user was assigned the name ${assignedName}`);
        });
        
        socket.on("message", ({ username, message }) => {
           console.log(`${username} sent a message: ${message}`); 
           
           socket.broadcast.emit("message", {username, message});
        });

        socket.on('disconnect', () => {
            let foundUser = chatDetails.users.find(
                user => user.id == socket.id
            );
            
            chatDetails.users = chatDetails.users.filter( 
                user => user.id !== socket.id
            );
            
            socket.broadcast.emit("update", chatDetails);
            
            console.log(`${foundUser.name} has disconnected`);
        });
    });
    
    return server;
}

module.exports = socket;
