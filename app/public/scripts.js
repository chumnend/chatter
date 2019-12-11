const socket = io();

const messageContent = document.querySelector(".message-content");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector(".message-form input");

const userContent = document.querySelector(".user-content");
const userCount = document.querySelector("#user-count");
const userName = document.querySelector("#user-name");


// DOM SCRIPTS ================================================================
messageForm.addEventListener("submit", event => {
    event.preventDefault();
    
    let username = userName.innerText;
    let message = messageInput.value;
    
    if(message === "") return;
    
    let element = document.createElement("li");
    element.classList.add("message-me");
    let node = document.createTextNode(`${username}: ${message}`);
    element.appendChild(node);
    messageContent.appendChild(element);
   
    socket.emit("message", {username, message});
    messageInput.value = " ";

    return false;
});

// SOCKET SCRIPTS =============================================================
socket.on("connect", () => {
    socket.emit("register", ({ users, name }) => {
        userCount.innerHTML = users.length;
        userName.innerHTML = name;
        
        users.forEach( user => {
            let element = document.createElement("li");
            let node = document.createTextNode(`${user.name}`);
            
            element.appendChild(node);
            userContent.appendChild(element);
        });
    });
});

socket.on("update", ({ users }) => {
    userCount.innerHTML = users.length;

    userContent.innerHTML = "";
    users.forEach( user => {
        let element = document.createElement("li");
        let node = document.createTextNode(`${user.name}`);
        element.appendChild(node);
        userContent.appendChild(element);
    });
});

socket.on("message", ({username, message}) => {
    let element = document.createElement("li");
    let node = document.createTextNode(`${username}: ${message}`);
    element.appendChild(node);
    messageContent.appendChild(element);
});
