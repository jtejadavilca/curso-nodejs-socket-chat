var socket = io();

var params = new URLSearchParams( window.location.search );

if( !params.has('nombre') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesario');
}

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de JQuery
var divUsuarios = $('#divUsuarios');
var frmEnviar = $('#frmEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

function renderizarUsuarios( personas ) {
    console.log('personas : ', personas);
    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>';

    for(var i = 0; i < personas.length; i++){
        var per = personas[i];
        html += '<li>';
        html += '    <a data-id="' + per.id + '" href="javascript:void(0)"><img src="assets/images/users/' + (i+1) + '.jpg" alt="user-img" class="img-circle"> <span>' + per.nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';

    }

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo){
    var html = '';

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if( mensaje.nombre === 'Administrador' ){
        adminClass = 'danger';
    }

    if(yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + ' am</div>';
        html += '</li>';
    } else {
        html += '<li>';
        html +=  mensaje.nombre === 'Administrador' ? '' : '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + ' am</div>';
        html += '</li>';
    }

    divChatbox.append(html);
    scrollBottom();
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    //heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if ( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//Listeners
divUsuarios.on('click', 'a', function(e){
    var id = $(this).data('id');
    if(id)
        console.log('ID : ', id);
});

frmEnviar.on('submit', function(e){
    e.preventDefault();

    var mensaje = $.trim(txtMensaje.val());
    if( mensaje.legth === 0 ){
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: mensaje
    }, function(mensajeSrv) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensajeSrv, true);
    });
});