const user = 'luffy'; //COM PROMPT E DEPOIS FAZER EM OUTRA TELA (BONUS)
const userObject = {name: `${user}`};

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

function sendMessage() {
    const message = document.querySelector("input").value;
    document.querySelector("input").value = "";

    const messageObject = {
        from: `${user}`,
        to: "Todos",
        text: `${message}`, 
        type: "message"
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