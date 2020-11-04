const express = require("express");
const app = express();
const pool = require("./db");
const socketio = require('socket.io');
const { v1: uuid } = require('uuid');
const _ = require('lodash');

var server = require('http').createServer(app);

app.set("view engine", "ejs");
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../client/static`));
app.set('views', `${__dirname}/../client/views`);

const io = socketio(server);

app.get("/", async(req, res) => {
    res.render("index");
});

app.get("/tetris", async(req, res) => {
    res.render("homepage");
});

const rooms = {};


/**
 * Will connect a socket to a specified room
 * @param socket A connected socket.io socket
 * @param room An object that represents a room from the `rooms` instance variable object
 */
const joinRoom = (socket, room) => {
    room.sockets.push(socket);
    socket.join(room.id, () => {
        // store the room id in the socket for future use
        socket.roomId = room.id;
        console.log(socket.id, "Joined", room.id);
    });
    console.log(room.sockets.length);
};



/**
 * The starting point for a user connecting to our lovely little multiplayer
 * server!
 */
io.on('connection', (socket) => {

    // give each socket a random identifier so that we can determine who is who when
    // we're sending messages back and forth!
    socket.id = uuid();
    console.log('a user connected');

    socket.emit('message', 'You are connected!');

    socket.on('message', (text) => io.emit('message', socket.name + ': ' + text));

    socket.on('setUsername', (text) => {
        socket.name = text;
        socket.emit('getUsername', socket.name);
    });


    /**
     * Lets us know that players have joined a room and are waiting in the waiting room.
     */
    socket.on('ready', () => {
        console.log(socket.id, "is ready!");
        const room = rooms[socket.roomId];
        socket.emit('roomL', room.sockets.length);
        // when we have two players... START THE GAME!
        if (room.sockets.length >= 2) {
            // tell each player to start the game.
            for (const client of room.sockets) {
                client.emit('initGame');
            }
            room.sockets = [];
        }
    });


    //Gets fired when someone wants to get the list of rooms. respond with the list of room names.
    socket.on('getRoomNames', (data, callback) => {
        const roomNames = [];
        for (const id in rooms) {
            const { name } = rooms[id];
            const room = { name, id };
            roomNames.push(room);
        }

        callback(roomNames);
    });

    function uniqueRoomID(){
        var rooms = [];
        var room;
        function codeCreate(){
            var i;
            var s = '';
            var num;
            for (i=0;i<=5;i++){
                num = Math.random() * 25;
                s += String.fromCharCode(65+num);
            }
            return s;
        }
        room = codeCreate();
        while (rooms.includes(room)){
            room = codeCreate();
        }
        return room;
    }

    //Gets fired when a user wants to create a new room.
    socket.on('createRoom', (roomName) => {
        const room = {
            id: uniqueRoomID(), // generate a unique id for the new room, that way we don't need to deal with duplicates.
            name: roomName,
            sockets: [],
            scores: []
        };
        rooms[room.id] = room;
        // have the socket join the room they've just created.
        joinRoom(socket, room);
        socket.emit('roomId', room.id);
    });

    //Gets fired when a player has joined a room.
    socket.on('joinRoom', (roomId, callback) => {
        console.log("Available room ids: ")
        for (i in rooms) {
            console.log(i.length);
        }
        console.log('Trying to connect to: #' + roomId.length + "#");
        const room = rooms[roomId];
        joinRoom(socket, room);
    });

    socket.on('gameOver', ({roomId, username, score}) => {
        console.log('Game over for ' + username);
        room = rooms[roomId];
        room.scores.push({score: Number(score), username: username});
        if (room.scores.length >= 2) {
            console.log('Game over for both');
            var maxScore = 0;
            for (const i of room.scores) {
                if (i.score > maxScore)
                    maxScore = i.score;
            }
            var countMax = 0;
            for (const i of room.scores) {
                if (i.score == maxScore)
                    countMax += 1;
            }
            var tie = false;
            if (countMax == 2) {
                tie = true;
            }
            room.sockets = [];
            room.scores = [];
            console.log("Max Score is " + maxScore);
            io.emit('winner', {score: maxScore, tie: tie});
        }
    });

    

});









app.get("/multiplayer:roomid", async(req, res) => {
    const { roomid } = req.params;
    console.log("Room id: " + roomid);
    res.render("multiplayer", { room_id: roomid });
});











// Add scores
app.post("/", async(req, res) => {
    const { nameInp, scoreInp, timeInp } = req.body;
    let errors = [];
    console.log(nameInp + ',' + scoreInp + ',' + timeInp);
    if (!nameInp) {
        nameInp = "anonymous";
    }

    pool.query(
        `INSERT INTO scores_test (name, score, time_taken)
         VALUES ($1, $2, $3) RETURNING id, name;`, [nameInp, scoreInp, timeInp],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {

                user_id = results.rows[0].id;
                pool.query(
                    `UPDATE scores_test
                     SET name=$1
                     WHERE id=$2;`, [results.rows[0].name + '#' + results.rows[0].id, results.rows[0].id],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results.rows);
                            res.redirect(`/scoreboard${user_id}`);
                        }
                    }
                );
            }
        }
    );
});


// Show scoreboard with rank +- 5 of given row id
app.get("/scoreboard:id", async(req, res) => {
    const id = req.params.id;
    console.log(id);
    pool.query(
        `DROP VIEW IF EXISTS scoreboard;`, [],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                pool.query(
                    `CREATE VIEW scoreboard as (SELECT ROW_NUMBER() OVER (ORDER BY score DESC, time_taken ASC)
                     AS rank, id, name, score, time_taken FROM scores_test);`, [],
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            pool.query(
                                `SELECT rank, name, score, time_taken FROM scoreboard
                                 WHERE rank >= ((SELECT rank FROM scoreboard WHERE id = $1) - 5) AND rank <= ((SELECT rank FROM scoreboard WHERE id = $1) + 5)
                                 ORDER BY rank;`, [id],
                                (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(results.rows);
                                        res.render("scoreboard", { entries: results.rows, USER_ID: id });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});


// Show entire scoreboard
app.get("/scoreboard", async(req, res) => {
    pool.query(
        `SELECT ROW_NUMBER() OVER (ORDER BY score DESC, time_taken ASC)
         AS rank, name, score, time_taken FROM scores_test;`, [],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.log(results.rows);
                res.render("scoreboard", { entries: results.rows, USER_ID: 0 });
            }
        }
    );
});



server.listen(3000, () => {
    console.log('Server started on port 3000');
});