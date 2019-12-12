const socket = io();

const messageContent = document.querySelector(".message-content");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector(".message-form input");

const userContent = document.querySelector(".user-content");
const userCount = document.querySelector("#user-count");
const userName = document.querySelector("#user-name");

// FUNCTIONS ==================================================================
function createListItem(target, text, classes = [])
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
        ["message-me"]
    );
   
    // pass message to others in chat
    socket.emit("message", {username, message});
    messageInput.value = " ";

    return false;
});

userName.addEventListener("click", () => {
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

socket.on("update", (res) => {
    let { users } = res;
    
    // update the state of users in the caht
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
