try {

const log = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
};


const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
}


(() => {
    togglePause();
    const sock = io();

    var usrname; 
    // alert(document.getElementById('room_id').innerHTML);

    document.getElementById('usernameSubmitButton').addEventListener('click', function() {
        usrname = document.getElementById('username').value;
        if (usrname != '') {
            document.getElementById('usernameInputOverlay').style.display = 'none';
            sock.emit('setUsername', usrname);
            // sock.on('getUsername', (arg) => {
            //     alert(arg);
            // });
            alert('Game will start when both players have entered!');
            sock.emit('joinRoom', (document.getElementById('room_id').innerHTML));
            sock.emit('ready');
        }
    });
    
    sock.on('initGame', () => {
        alert('inin');
        if (paused) {
            togglePause();
        }
    });

    sock.on('message', log);
    document
        .querySelector('#chat-form')
        .addEventListener('submit', onChatSubmitted(sock));
})();

}catch(err) {
    alert(err);
}