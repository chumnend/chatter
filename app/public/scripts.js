const socket = io();
const input = document.getElementById('m');
const messages = document.getElementById('messages');
const form = document.querySelector("form");

var name = "";

form.addEventListener("submit", event => {
    event.preventDefault();
    
    var element = document.createElement('li');
    var textNode = document.createTextNode("Me:" + input.value);
    element.appendChild(textNode);
    messages.appendChild(element);
    
    socket.emit("chat message", input.value);
    input.value = " ";
    return false;
});

input.addEventListener("focus", event => {
    socket.emit("typing", name);
});

socket.on("connect", () => {
    let inputtedName = prompt("Enter your name");
    socket.emit("assign", { name: inputtedName });
    name = inputtedName;
});

socket.on('alert', msg => {
    var element = document.createElement('li');
    var textNode = document.createTextNode(msg);
    element.appendChild(textNode);
    messages.appendChild(element);
});

socket.on('chat message', msg => {
    var element = document.createElement('li');
    var textNode = document.createTextNode(msg);
    element.appendChild(textNode);
    messages.appendChild(element);
});
