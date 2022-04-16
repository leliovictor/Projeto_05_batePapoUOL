let user;
let userObject;
let typeMessage = 'message';
let participantContact = 'Todos';

function defineName() {
    const element = document.querySelector("#name");

    if (element.value === '') {
        alert("Por favor, insira um nome de usuário!")
    } else {
        user = element.value;
        userObject = {name: `${element.value}`};

        startLoadScreen(element);

        login();
    }
}

function startLoadScreen(element) {
    const loadScreen = document.querySelector(".loadScreen");
    loadScreen.classList.toggle("disabled");
    element.parentElement.classList.toggle("disabled");
}

function login() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",userObject);

    promise.then(startChat);
    promise.catch(invalidName);
}

function startChat() {
    document.querySelector(".login").classList.add("disabled");

    setInterval(refreshLogin,5000);

    getAllMessages();
    setInterval(getAllMessages,3000);

    getAllParticipants();
    setInterval(getAllParticipants,10000);
}

function refreshLogin() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObject);
}

function getAllMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(getMessage);
}

function getMessage(arrObject) {
    cleanLastMessages();

    const messages = arrObject.data;
    messages.map(renderMessage);
}

function cleanLastMessages() {
    document.querySelector("main").innerHTML = "";
}

function renderMessage(object) {
    const element = document.querySelector("main");
    
    if (object.type === 'status') {
        element.innerHTML += `
        <div class="status">
        <p><span class="time">(${object.time})</span> <span class="person">${object.from}</span> ${object.text}</p>
        </div>
        `
    }

    if(object.type === 'message') {
        element.innerHTML += `
        <div class="message">
        <p><span class="time">(${object.time})</span> <span class="person">${object.from}</span> para <span class="person">${object.to}</span>: ${object.text}</p>
        </div>
        `
    }
    
    if(privateMessage(object)) {
        element.innerHTML += `
        <div class="private_message">
        <p><span class="time">(${object.time})</span> <span class="person">${object.from}</span> reservadamente para <span class="person">${object.to}</span>: ${object.text}</p>
        </div>
        `
    }

    LastMessageIntoView();
}

function privateMessage(object) {
    return (object.type === 'private_message' && (object.from === user || object.to === user || object.to === 'Todos'));
}

function LastMessageIntoView() {
    const lastMessage = document.querySelector("main div:last-child");
    lastMessage.scrollIntoView();
}

function getAllParticipants() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    promise.then(getParticipant);
}

function getParticipant(arrObject) {
    const participant = arrObject.data;
    participant.map(renderParticipant);
}

function renderParticipant(object) {
    const element = document.querySelector(".participants");
    if (CheckParticipantAlreadyOnline(object,element)) {
        element.innerHTML += `
            <div id="${object.name}" onclick="selectParticipants(this)">
                <ion-icon name="person-circle"></ion-icon>
                <h2>${object.name}</h2>
                <ion-icon name="checkmark-sharp" class="checkSelect"></ion-icon>
            </div>
            `
    }
}

function CheckParticipantAlreadyOnline(object,element) {
    return (element.querySelector(`#${object.name}`) === null)
}

function sendMessage() {
    const message = document.querySelector("#sendMessage").value;
    document.querySelector("#sendMessage").value = "";

    const messageObject = {
        from: `${user}`,
        to: `${participantContact}`,
        text: `${message}`, 
        type: `${typeMessage}`
    }
    
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",messageObject);
    promise.then(getAllMessages);
    promise.catch(refreshLogin);
}

function pressEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function toggleSideBar() {
    document.querySelector("nav").classList.toggle("disabled");
}

function selectVisibility(element) {
    const checkMark = element.querySelector(".checkSelect");
    
    if (!checkMark.classList.contains("enabled")) {
        element.parentElement.querySelector(".enabled").classList.remove("enabled");
        checkMark.classList.add("enabled");
    }

    selectTypeMessage(element);
}

function selectTypeMessage(element) {
    typeMessage = element.getAttribute("id");

    addSendToMessagePrivate();
}

function selectParticipants(element) {
    const checkMark = element.querySelector(".checkSelect");
    
    if (!checkMark.classList.contains("enabled")) {
        element.parentElement.querySelector(".enabled").classList.remove("enabled");
        checkMark.classList.add("enabled");
    }

    selectParticipantToSendMessage(element);
}

function selectParticipantToSendMessage(element) {
    participantContact = element.getAttribute("id");

    addSendToMessagePrivate();
}

function addSendToMessagePrivate() {
    if (typeMessage === 'private_message') {
        document.querySelector(".sendToReservation").innerHTML = `
        <p>Enviando para ${participantContact} (reservadamente)
        `
    } else {
        document.querySelector(".sendToReservation").innerHTML ="";
    }
}

function refreshPage() {
    return window.location.reload();
}

function invalidName() {
    alert("Nome escolhido já em uso, por favor, escolha outro.")
    window.location.reload();
}