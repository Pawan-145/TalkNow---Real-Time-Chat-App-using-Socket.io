const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

var sound =  new Audio('ting.mp3');
sound.load();

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left')
    {
        sound.play();
    }
};

//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join") || "Anonymous";
socket.emit('new-user-joined', name);

//If a new user joins receive his name the event from the server 
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

//If server send the message, receive it 
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left'); // Fix message format & position
});

//If a user leaves the chat, append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,'left')
})

// If the form gets submitted, send sever the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});
