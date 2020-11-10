function showCreateRoomForm() {
    document.getElementById('createRoomBtn').style.display = 'none';
    document.getElementById('createRoomForm').style.display='';
}

function showJoinRoomForm() {
    document.getElementById('joinRoomBtn').style.display = 'none';
    document.getElementById('joinRoomForm').style.display='';
}

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
        // sock.emit('ready', document.getElementById('joinRoomInp').value);
    });

    document.getElementById('joinRoomInpButton').addEventListener('click', () => {
        alert(document.getElementById('joinRoomInp').value);
        roomId = document.getElementById('joinRoomInp').value;
        sock.emit('joinRoom', roomId);
        sock.emit('ready', roomId);
    });


    sock.on('initGame', () => {
        sock.emit('deletePrevSockets', roomId);
        alert("Game Started");
        window.location.href = '/multiplayer' + roomId;
    });

})();