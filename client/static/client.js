try {
    (() => {

        const sock = io();

        document.getElementById('createRoomInpButton').addEventListener('click', () => {
            var resp = window.prompt("Your username: ");
            sock.emit('setUsername', resp);
            sock.on('getUsername', (arg) => {
                alert(arg);
            });
            sock.emit('createRoom', (document.getElementById('createRoomInp').value));
            sock.on('roomId', (arg) => {
                alert(arg);
            });
        });

        document.getElementById('joinRoomInpButton').addEventListener('click', () => {
            var resp = window.prompt("Your username: ");
            sock.emit('setUsername', resp);
            sock.on('getUsername', (arg) => {
                alert(arg);
            });
            alert(document.getElementById('joinRoomInp').value);
            sock.emit('joinRoom', (document.getElementById('joinRoomInp').value));
            sock.emit('ready');
        });


        sock.on('initGame', () => {
            alert("Game Started");
            window.location.href='/multiplayer';
        });
        sock.on('roomL', (len) => {
            alert(len);
        });

        return {
            getSocket: function() { return sock;}
        }

    })();

} catch (err) {
    alert(err);
}