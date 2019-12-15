window.addEventListener('load', function () {
    const socket = io();
    
    const messageContent = document.querySelector(".message-content");
    const messageForm = document.querySelector(".message-form");
    const messageInput = document.querySelector(".message-form input");
    const messageTyping = document.querySelector(".message-typing");
    
    const userContent = document.querySelector(".user-content");
    const userCount = document.querySelector("#user-count");
    const userName = document.querySelector("#user-name");
    
    // FUNCTIONS ==================================================================
    function createListItem(target, text, ...classes)
    {
        let element = document.createElement("li");
        if(classes.length > 0) {
            classes.forEach( c => element.classList.add(c));
        }
        let node = document.createTextNode(text);
        element.appendChild(node);
        target.appendChild(element);
        
        return element;
    }
    
    // DOM SCRIPTS ================================================================
    messageForm.addEventListener("submit", event => {
        event.preventDefault();
        
        let sender = userName.innerText;
        let message = messageInput.value;
        
        // ensure empty input is not sent
        if(!message || message.trim() === "") {
            return false;
        }
        
        // check if private message
        if(message.startsWith("::")) {
            let extracted = /(::)(\S+)\s(.+\b)/.exec(message);
            
            // append own message to the chat
            createListItem(
                messageContent, 
                `${sender} (me) to ${extracted[2]}: ${extracted[3]}`, 
                "message-me", 
                "message-private"
            );
            
            // emit to target user
            socket.emit("private message", { 
                sender,
                reciever: extracted[2],
                message: extracted[3]
            });
             messageInput.value = "";
            
            return false;
        }
        
        // append own message to the chat
        createListItem(
            messageContent, 
            `${sender} (me): ${message}`, 
            "message-me"
        );
        
        // pass message to others in chat
        socket.emit("message", { sender, message });
        messageInput.value = "";
    
        return false;
    });
    
    messageInput.addEventListener("focusin", (event) => {
        socket.emit("start typing"); 
    });
    
    messageInput.addEventListener("focusout", (event) => {
        socket.emit("stop typing"); 
    });
    
    userName.addEventListener("click", (event) => {
        let newName = prompt("Enter New Name: ");
        
        socket.emit("name change", newName, (res) => {
            if(res) {
                userName.innerHTML = newName;
                window.localStorage.setItem("chatname", newName);
            } else {
                alert("Name already taken");
            }
        });
    });
    
    // SOCKET SCRIPTS =============================================================
    socket.on("connect", () => {
        
        // load previous saved name 
        var prevName = window.localStorage.getItem("chatname");
        
        // on connect get details of the chat and get a default name
        socket.emit("register", prevName, (res) => {
            let { users, name } = res;
    
            userCount.innerHTML = users.length;
            userName.innerHTML = name;
    
            users.forEach( user => {
                let ele = createListItem(userContent, `${user.name}`);
                ele.addEventListener("click", (event) => {
                    messageInput.value = `::${user.name} `;
                });
            });
        });
    });
    
    socket.on("alert", (msg) => {
        createListItem(messageContent, msg, "message-alert");
    });
    
    socket.on("update", (res) => {
        let { users, typing } = res;
        
        // update typing list
        if(typing.length == 0) {
            messageTyping.classList.add("hide");
        } 
        else{
            messageTyping.classList.remove("hide");
            messageTyping.innerHTML = "";
    
            typing.length == 1
                ? createListItem(messageTyping, `${typing[0]} is typing...`)
                : createListItem(messageTyping, `Multiple users are typing...`);
        }
    
        // update the state of users in the chat
        userCount.innerHTML = users.length;
    
        userContent.innerHTML = "";
        users.forEach( user => {
            let ele = createListItem(userContent, `${user.name}`);
            ele.addEventListener("click", (event) => {
                messageInput.value = `::${user.name} `;
            });
        });
    });
    
    socket.on("message", (res) => {
        let { sender, message } = res;
    
        // append received message to the chat
        createListItem(messageContent, `${sender}: ${message}`);
    });
    
    socket.on("private message", (res) => {
        let { sender, message } = res;
    
        // append received message to the chat
        createListItem(
            messageContent,
            `${sender} (private): ${message}`,
            "message-private"
        );
    });
    
    socket.on("reconnecting", () => {
        // clear all content
        userContent.innerHTML = "";
        messageContent.innerHTML = "";
    });
});
