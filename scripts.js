const user = 'luffy'; //COM PROMPT E DEPOIS FAZER EM OUTRA TELA (BONUS)
const userObject = {name: `${user}`};
//MENSAGEM: 

//`<div class="login"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> entra na sala...</h1></div>`
//`<div class="reserved"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> reservadamente para <span class="person">${RECEBIDO}</span>: ${MENSAGEM}</h1></div>`
//`<div class="message"><h1><span class="time">(${TEMPO})</span>  <span class="person">${FALANTE}</span> para <span class="person">${RECEBIDO}</span>:  ${MENSAGEM}</h1></div>

function login() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",userObject);

    promisse.then(renderLogin);
    promisse.catch(deuErrado);

}

function renderLogin() {
    const element = document.querySelector("main");
    element.innerHTML += `
    <div class="status">
    <p><span class="time">(${getTime()})</span> <span class="person">${user}</span> entra na sala...</p>
    </div>
    `

    setInterval(refreshLogin,5000);
}

function refreshLogin() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObject);
    
    promisse.catch(deuErrado);

}


function sendMessage() {
    const message = document.querySelector("input").value;

    const messageObject = {
        from: "Luffy",
        to: "Todos",
        text: `${message}`, 
        type: "message"
    }
    
    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",messageObject);
    promisse.then(deuCerto);
    promisse.catch(deuErrado);
}

function deuCerto() {
    console.log("ok");
}

function deuErrado() {
    alert('deu ruim');
}

function getTime() {
    const date = new Date();
    const timer = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return timer;
}

//3 tipos de mensagem - status, message, private_message