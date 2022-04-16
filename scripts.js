const user = 'luffy'; //COM PROMPT E DEPOIS FAZER EM OUTRA TELA (BONUS)
const userObject = {name: `${user}`};
let typeMessage = 'message';
let participantContact = 'Todos';

//REMOVER O DEU ERRADO E DEU CERTO DE FUNCAO E DENTRO DOS CATCH NO FINAL DO PROJETO;
//REMOVER FUNCOES DE TESTE, FINAL DO JS


//MENSAGEM: 

//`<div class="login"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> entra na sala...</h1></div>`
//`<div class="reserved"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> reservadamente para <span class="person">${RECEBIDO}</span>: ${MENSAGEM}</h1></div>`
//`<div class="message"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> para <span class="person">${RECEBIDO}</span>:  ${MENSAGEM}</h1></div>

//3 tipos de mensagem - status, message, private_message
//<p>Enviando para Maria (reservadamente)</p> QUANDO FOR ENVIAR EM PRIVADO!!!
//class .sendToReservation


function login() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",userObject);

    promisse.then(startChat);
    promisse.catch(deuErrado);

}

function startChat() {
    setInterval(refreshLogin,5000);

    getAllMessages();
    setInterval(getAllMessages,3000);

    getAllParticipants();
    setInterval(getAllParticipants,10000);
}

function refreshLogin() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObject);
    
    promisse.catch(deuErrado);

}

function getAllMessages() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promisse.then(getMessage);
    promisse.catch(deuErrado);
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
    return (object.type === 'private_message' && (object.to === user || object.to === 'Todos'));
}

function LastMessageIntoView() {
    const lastMessage = document.querySelector("main div:last-child");
    lastMessage.scrollIntoView();
}

function getAllParticipants() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

    promisse.then(getParticipant);
    promisse.catch(deuErrado);
}

function getParticipant(arrObject) {
    const participant = arrObject.data;
    participant.map(renderParticipant);
}

function renderParticipant(object) {
    const element = document.querySelector(".participants");

    element.innerHTML += `
    <div id="${object.name}" onclick="selectParticipants(this)">
        <ion-icon name="person-circle"></ion-icon>
        <h2>${object.name}</h2>
        <ion-icon name="checkmark-sharp" class="checkSelect"></ion-icon>
    </div>
    `
}

function sendMessage() {
    const message = document.querySelector("input").value;
    document.querySelector("input").value = "";

    const messageObject = {
        from: `${user}`,
        to: `${participantContact}`,
        text: `${message}`, 
        type: `${typeMessage}`
    }
    
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",messageObject);
    promisse.then(getAllMessages);
    promisse.catch(deuErrado);
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

    //ADICIONAR AQUI A PESSOA QUE VAI MANDAR SE RESERVADO PARA COOLOCR EMBAIXO DO INPUT
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
}

//FUNCOES DE TESTE, REMOVER AO FIM DO PROJETO

function deuCerto() {
    console.log("ok");
}

function deuErrado() {
    alert('deu ruim');
}

function mostrar(objeto) {
    console.log(objeto);
}