try {

    (() => {

        const sock = io();
        document.getElementById('createRoomInpButton').addEventListener('click', () => {

            sock.emit('createRoom', (document.getElementById('createRoomInp').value));
            sock.on('roomId', (arg) => {
                alert(arg);
            })
        })

        document.getElementById('joinRoomInpButton').addEventListener('click', () => {
            alert(document.getElementById('joinRoomInp').value);
            sock.emit('joinRoom', (document.getElementById('joinRoomInp').value));
            sock.emit('ready');
        })

        sock.on('initGame', () => {
            alert("Game Started");
        })
        sock.on('roomL', (len) => {
            alert(len);
        })

    })();

} catch (err) {
    alert(err);
}