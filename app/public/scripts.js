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
}

// DOM SCRIPTS ================================================================
messageForm.addEventListener("submit", event => {
    event.preventDefault();
    
    let username = userName.innerText;
    let message = messageInput.value;
    
    // ensure empty input is not sent
    if(message === "") return;
    
    // append own message to the chat
    createListItem(
        messageContent, 
        `${username} (me): ${message}`, 
        "message-me"
    );
   
    // pass message to others in chat
    socket.emit("message", {username, message});
    messageInput.value = " ";

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
        } else {
            alert("Name already taken");
        }
    });
});

// SOCKET SCRIPTS =============================================================
socket.on("connect", () => {
    // on connect get details of the chat and get a default name
    socket.emit("register", (res) => {
        let { users, name } = res;
        
        userCount.innerHTML = users.length;
        userName.innerHTML = name;
        
        users.forEach( user => {
            createListItem(userContent, `${user.name}`);
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
        createListItem(userContent, `${user.name}`);
    });
});

socket.on("message", (res) => {
    let { username, message } = res;
    
    // append received message to the chat
    createListItem(messageContent, `${username}: ${message}`);
});

socket.on("reconnecting", () => {
    // clear all content
    userContent.innerHTML = "";
    messageContent.innerHTML = "";
});
