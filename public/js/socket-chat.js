var socket = io();

var params = new URLSearchParams( window.location.search );

var nombre = params.get('nombre');
var sala = params.get('sala');
$('title').text('Usuario : ' + nombre + ' [' + sala + ']');

var usuario = {
    nombre: nombre,
    sala: sala
};
socket.on('connect', function(){
    console.log('Conectado con el servidor..');

    socket.emit('entrarChat', usuario, function(resp){
        // console.log('Usuarios conectador : ', resp);
        renderizarUsuarios(resp);
    });
});

socket.on('disconnect', function() {
    console.log('Desconectado del servidor');
});

// Enviar información
// socket.emit('crearMensaje', {
//     mensaje: 'Este es un mensaje desde el cliente'
// }, function(feedback) {
//     console.log('Se disparó el callback : ', feedback.mensaje);
// });

// Escuchar información
socket.on('crearMensaje', function(mensajeSrv) {
    renderizarMensajes(mensajeSrv);
});

// Escuchar cambios de usuarios
// Cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(mensaje) {
    renderizarUsuarios(mensaje, false);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje privado ', mensaje);
});