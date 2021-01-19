const divUsuarios = document.querySelector('#divUsuarios');
const formEnviar = document.querySelector('#formEnviar');
const txtMensaje = document.querySelector('#txtMensaje');
const divChatbox = document.querySelector('#divChatbox');



const renderizarUsuarios = (personas) => {

    let html = `
    <li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
    </li>
    `
    for (const persona of personas) {

        html += `<li>
            <a data-id='${persona.id}' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
        </li>`
    }

    divUsuarios.innerHTML = html;

}


// TODO: fix this function.
const  scrollBottom = () => {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


const renderizarMensajes = (mensaje, yo = false) => {

    let fecha = new Date( mensaje.fecha );
    let hora = `${ fecha.getHours() + ':' + fecha.getMinutes() }`;

    if ( mensaje.nombre === 'Administrador' ) {
        
        let mensajeAdmin = `<p> <span>${ mensaje.nombre }</span> : ${ mensaje.mensaje }.</p>`;

        let divAdmin = document.createElement('div');
        divAdmin.innerHTML = mensajeAdmin;
        divAdmin.className = 'row justify-content-center';

        divChatbox.appendChild(divAdmin);
        return;
    }

    let htmlChatRow = `
    
        <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />
        </div>
        <div class="chat-content">
            <h5>${ mensaje.nombre }</h5>
            <div class="box bg-light-info">${ mensaje.mensaje }</div>
        </div>
        <div class="chat-time">${ hora }</div>
    
    `

    let mensajeHtml = document.createElement('li');
    mensajeHtml.className = 'animated fadeIn';

    if ( yo ) {

        htmlChatRow = `
        
            <div class="chat-content">
                <h5>${ mensaje.nombre }</h5>
                <div class="box bg-light-inverse">${ mensaje.mensaje }</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />
            </div>
            <div class="chat-time">${ hora }</div>
        
        `
        mensajeHtml.classList.add('reverse');
    }

    mensajeHtml.innerHTML = htmlChatRow;

    divChatbox.appendChild(mensajeHtml);

}







// LISTENERS    

divUsuarios.addEventListener('click', (e) => {

    let nombreElemento = e.target.localName;
    let elemento = e.target;

    if (nombreElemento.includes('span') || nombreElemento.includes('small') || nombreElemento.includes('img')) {

        elemento = (nombreElemento === 'small') ? elemento.parentElement.parentElement : elemento.parentElement;

        let id = elemento.getAttribute('data-id');

        if (id) {
            console.log(id);
        }


    } else if (nombreElemento.includes('a')) {
        let id = elemento.getAttribute('data-id');

        if (id) {
            console.log(id);
        }


    }




})




formEnviar.addEventListener('submit', (e) => {

    e.preventDefault();

    if (txtMensaje.value.trim().length === 0) {
        return;
    }

    console.log(txtMensaje.value);

    // Enviar información
    socket.emit('crearMensaje', {
        mensaje: txtMensaje.value
    },  (mensaje) => {
        txtMensaje.value = '';
        txtMensaje.focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


})