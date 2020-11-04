// const { time } = require("console");

// const { Socket } = require("dgram");

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
        multiplayeMode = true;
        init_load = 0;

        const sock = io();

        var usrname;

        document.getElementById('usernameSubmitButton').addEventListener('click', function() {
            usrname = document.getElementById('username').value;
            // alert(usrname);
            if (usrname != '') {
                document.getElementById('usernameInputOverlay').style.display = 'none';
                sock.emit('setUsername', usrname);
                sock.emit('joinRoom', (document.getElementById('room_id').innerHTML));
                sock.emit('ready');
                alert('Game will start when both players have entered!');
                if (!paused)
                    togglePause();
            }
        });

        sock.on('initGame', () => {
            if (paused)
                togglePause();
            startNewGame();
            mins = 1;
            secs = 0;
            decisecs = 0;
        });

        sock.on('message', log);

        sock.on('winner', ({score, tie}) => {
            if (!gameOver) {
                gameOver = true;
                alert('Time Up!');
            }
            if (Number(scoreElement.innerHTML) >= Number(score)) {
                if (tie)
                    alert('There was a tie!');
                else 
                    alert('You won!');
            } else {
                alert('You lost!');
            }
            sock.emit('leaveRoom');
        });
        
        document.querySelector('#chat-form').addEventListener('submit', onChatSubmitted(sock));
        
        var gameOverSent = false;

        setInterval(async function() {
            if (!gameOver && !paused) {
                decisecs -= 1;
                if (decisecs == -1) {
                    decisecs = 9;
                    secs -= 1;
                }
                if (secs == -1) {
                    secs = 59;
                    mins -= 1;
                }
                var dispTime = '';
                if (mins < 10) {
                    dispTime += '0';
                }
                dispTime += mins + ':';
                if (secs < 10) {
                    dispTime += '0';
                }
                dispTime += secs + '.';
                dispTime += decisecs;

                timeElement.innerHTML = dispTime;
                if (dispTime == "00:00.0") {
                    alert("Time Up!");
                    gameOver = true;
                    gameOverSent = true;
                    sock.emit('gameOver', {roomId: document.getElementById('room_id').innerHTML, username: usrname, score: scoreElement.innerHTML});
                    clearInterval();
                }
            } else if (gameOver && !gameOverSent) {
                sock.emit('gameOver', {roomId: document.getElementById('room_id').innerHTML, username: username, score: scoreElement.innerHTML});
                gameOverSent = true;
                clearInterval();
            }
        }, 100);

        setInterval(async function() {
            if (!gameOver && !paused) {
                sock.emit('receiveScore', ({username: usrname, score: scoreElement.innerHTML}));
            }
        }, 100);

        sock.on('sendScore', ({score, username}) => {
            if (username != usrname) {
                oppScore.innerHTML = score;
            }
        });
    })();
    


} catch (err) {
    alert(err);
}