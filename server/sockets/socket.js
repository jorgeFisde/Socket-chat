const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', ( data, callback ) => {

        if ( !data.nombre || !data.sala) {
            return callback({
                err: true,
                message: 'El nombre/sala es necesario'
            })
        }

        // Me uno a una sala en especifico con join
        client.join(data.sala);

        usuarios.agregarPesona( client.id, data.nombre, data.sala );

        callback( usuarios.getPersonaPorSala(data.sala) );

        client.broadcast.to(data.sala).emit( 'crearMensaje', crearMensaje( 'Administrador', `${ data.nombre } se ha unido` ) );
        client.broadcast.to(data.sala).emit( 'listaPersonas', usuarios.getPersonaPorSala(data.sala) );

    })

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona( client.id )

        let mensaje = crearMensaje( persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit( 'crearMensaje', mensaje );

        callback( mensaje );

    })

    client.on( 'disconnect', () => {

        let personaBorrada = usuarios.borrarPersona( client.id );


        client.broadcast.to(personaBorrada.sala).emit( 'crearMensaje', crearMensaje( 'Administrador', `${ personaBorrada.nombre } salió` ) );
        client.broadcast.to(personaBorrada.sala).emit( 'listaPersonas', usuarios.getPersonaPorSala(personaBorrada.sala) );

    });


    // mensajes privados

    client.on( 'mensajePrivado', data => {

        let from = usuarios.getPersona( client.id );

        client.broadcast.to( data.to ).emit( 'mensajePrivado', crearMensaje( from.nombre, data.mensaje ) );

    })



});