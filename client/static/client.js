try {
    (() => {

        const sock = io();
        var roomId;

        document.getElementById('createRoomInpButton').addEventListener('click', () => {
            sock.emit('createRoom', (document.getElementById('createRoomInp').value));
            sock.on('roomId', (arg) => {
                roomId = arg;
                alert('Share this room id: ' + arg);
                alert('Game will start as soon as other person joins!');
            });
        });

        document.getElementById('joinRoomInpButton').addEventListener('click', () => {
            // alert(document.getElementById('joinRoomInp').value);
            roomId = document.getElementById('joinRoomInp').value;
            sock.emit('joinRoom', (document.getElementById('joinRoomInp').value));
            sock.emit('ready');
        });


        sock.on('initGame', () => {
            alert("Game Started");
            window.location.href = '/multiplayer' + roomId;
        });
        sock.on('roomL', (len) => {
            alert(len);
        });

    })();

} catch (err) {
    alert(err);
}