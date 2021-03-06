var socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has('nombre')) {

    window.location = 'index.html';
    throw new Error('El nombre es necesario.');

}

let usuario = {

    nombre: params.get('nombre'),
    sala: params.get('sala'),

}


socket.on('connect', function () {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function (resp) {
        // console.log('Usuarios conectados:', resp);

        renderizarUsuarios(resp);

    });

});

// escuchar
socket.on('disconnect', function () {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function (mensaje) {

    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje);
    scrollBottom();
});

/**
 *  Escuchar cambios de usuarios
 *  Cuando un usuario entra o sale del chat
 */

socket.on('listaPersonas', function (personas) {

    console.log(personas);

    renderizarUsuarios(personas);

});

/**
 *  mensaje privaado
 */

socket.on( 'mensajePrivado', function( mensaje ) {

    console.log('mensaje privado:', mensaje);

});







