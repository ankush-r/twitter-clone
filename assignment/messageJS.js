const socket = io("http://localhost:3500");

const storedUserDetailsJSON = sessionStorage.getItem('loggedInUser');
const storedUserDetails = JSON.parse(storedUserDetailsJSON);
const user = storedUserDetails.userDetails;
const userName = user.user_name;
const profilePicUrl = user.profile_url;


let receiver = '';

function changingPersona(){
    document.getElementById('changeFirst').innerText = userName;
    document.getElementById('changeSecond').innerText=userName;
}

changingPersona();


console.log(userName+ profilePicUrl);

window.onload = function() {
    socket.emit('userInfo', { userName, profilePicUrl });
    console.log(userName);
};

socket.on('activeUsers', (activeUsers) => {
    const activeUsersContainer = document.getElementById('active__users');

    // Remove all child elements (clear the UI)
    activeUsersContainer.innerHTML = '';

    // Iterate through the new active users
    activeUsers.forEach((user) => {
        const userObject = document.createElement('button');
        userObject.style.display = 'flex';

        const imageNow = document.createElement('img');
        imageNow.src = user.profilePicUrl;
        console.log(user.profilePicUrl);
        imageNow.style.width='50px';
        imageNow.style.height='50px';
        imageNow.style.borderRadius = '50%';
        
        userObject.classList.add('user');
        userObject.id = user.socketId;  // Use the userName as the element ID
        userObject.innerHTML = `<img src="${user.profilePicUrl}" style="width: 50px; height: 50px; border-radius: 50%;">${user.userName}`;

        userObject.addEventListener('click',()=>{
            receiver = userObject.id;
            if (receiver) {
                socket.emit('fetchMessages', { receiver });
            }
            console.log(receiver);
            document.getElementById('message-container').innerHTML ='';
        });
        activeUsersContainer.appendChild(userObject);
    });
});

socket.on('disconnected',(payload)=>{
    const elem = document.getElementById(payload);
    elem.remove();
})

const send = document.getElementById('send');


socket.on('receivingMessage', (body) => {
    const msg = body.message;
    const messageElement = document.createElement('div');
    messageElement.innerText = msg;
    messageElement.classList.add('receiver');
    const mainDisplayer = document.getElementById('message-container');
    mainDisplayer.appendChild(messageElement);
    const button = document.getElementById(body.sender);
    button.click();
});

send.addEventListener('click', () => {
    const inputMessage = document.getElementById('inputMessage').value;

    // Check if a receiver is selected
    if (receiver && receiver !== socket.id) {
        socket.emit('messageSending', { receiver, inputMessage });
    }

    const mainDisplayer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.innerText = inputMessage;
    messageElement.classList.add('sender');
    mainDisplayer.appendChild(messageElement);

    document.getElementById('inputMessage').value = '';
});

// Client-side code
socket.on('fetchedMessages', (body) => {
    const messages = body.messages;
    const mainDisplayer = document.getElementById('message-container');
    
    // Clear existing messages
    mainDisplayer.innerHTML = '';

    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message.message;

        if (message.sender === socket.id) {
            messageElement.classList.add('sender');
        } else {
            messageElement.classList.add('receiver');
        }

        mainDisplayer.appendChild(messageElement);
    });
});


