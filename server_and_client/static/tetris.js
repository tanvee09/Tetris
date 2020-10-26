try {
    const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');
var timeElement = document.getElementById('time');

// instantiating 3 futurePiece Context
const fp1 = document.getElementById('futurePiece1');
const ctxfp1 = fp1.getContext('2d');

const holdCvs = document.getElementById('hold');        //this is the area for help piece
const ctxHold = holdCvs.getContext('2d'); 

// const fp2 = document.getElementById('futurePiece2');
// const ctxfp2 = fp2.getContext('2d');

// const fp3 = document.getElementById('futurePiece3');
// const ctxfp3 = fp3.getContext('2d');


var gameVolume = 1;
const ROW = 20;
const COL = 10;
const SQ = squareSize = 30;
var VACANT = 'aliceblue';
var lineColor = 'black';

const FP_ROWS = 17;
const FP_COLS = 5;

const HOLD_COLS = 5;
const HOLD_ROWS = 5;

const PIECES = [
    [Cleaveland, 'red'],
    [RhodeIsland, 'green'],
    [Teewee, 'indigo'],
    [SmashBoy, 'yellow'],
    [Hero, 'cyan'],
    [OrangeRicky, 'orange'],
    [BlueRicky, 'blue']
];


// Create board

let board = [];
var score = 0;

let gameOver = false;

var mins = 0, secs = 0, decisecs = 0;


// Draw the square

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    // ctx.strokeStyle = 'white';
    // ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// Draws a particular Predicted piece
function drawSquareForNextPieces(x, y, color, num) {
    // num specifies which predicted shape it draws
    // if (num == 0) {
        ctxfp1.fillStyle = color;
        ctxfp1.fillRect(x * SQ, y * SQ, SQ, SQ);
        if (color != VACANT) {
            ctxfp1.strokeStyle = lineColor;
            ctxfp1.strokeRect(x * SQ, y * SQ, SQ, SQ);
        }
        
    // }
    // if (num == 1) {
    //     ctxfp2.fillStyle = color;
    //     ctxfp2.fillRect(x * SQ, y * SQ, SQ, SQ);

    //     if (color != VACANT) {
    //         ctxfp2.strokeStyle = 'white';
    //         ctxfp2.strokeRect(x * SQ, y * SQ, SQ, SQ);
    //     }
    // }
    // if (num == 2) {
    //     ctxfp3.fillStyle = color;
    //     ctxfp3.fillRect(x * SQ, y * SQ, SQ, SQ);

    //     if (color != VACANT) {
    //         ctxfp3.strokeStyle = 'white';
    //         ctxfp3.strokeRect(x * SQ, y * SQ, SQ, SQ);
    //     }
    // }
}


function drawfuturePieces() {
    drawAllNextPiecesBoard();
    for (var num = 0; num < 3; num++) {
        let nextPiece = futurePieces[num];
        let startingX = (5 - nextPiece.activeTetromino.length)/2;
        let startingY = (5 - nextPiece.activeTetromino.length)/2;
        for (var r = 0; r < nextPiece.activeTetromino.length; r++) {
            for (var c = 0; c < nextPiece.activeTetromino.length; c++) {
                if (nextPiece.activeTetromino[r][c]) {
                    drawSquareForNextPieces(startingX + c, 6 * num + startingX + r, nextPiece.color, num);
                }
            }
        }
    }
}


// Draw the board

function drawBoard() {
    for (var r = 0; r < ROW; r++) {
        for (var c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

function drawAllNextPiecesBoard() {
    for (var num = 0; num < 3; num++) {
        for (var r = 0; r < FP_ROWS; r++) {
            for (var c = 0; c < FP_COLS; c++) {
                drawSquareForNextPieces(c, r, VACANT, num);
            }
        }
    }
}





// draw squares for hold piece board
function drawSquareForHeldPiece(x, y, color) {
    ctxHold.fillStyle = color;
    ctxHold.fillRect(x * SQ, y * SQ, SQ, SQ);
    if (color != VACANT) {
        ctxHold.strokeStyle = lineColor;
        ctxHold.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
}


// Draw hold piece board
function drawHoldPieceBoard() {
    for (var r = 0; r < HOLD_ROWS; r++) {
        for (var c = 0; c < HOLD_COLS; c++) {
            drawSquareForHeldPiece(c, r, VACANT);
        }
    }
}


// // Draw held piece
// function drawHeldPiece(heldPiece) {
//     drawHoldPieceBoard();
//     let startingX = (5 - heldPiece.activeTetromino.length)/2;
//     let startingY = (5 - heldPiece.activeTetromino.length)/2;
//     for (var r = 0; r < heldPiece.activeTetromino.length; r++) {
//         for (var c = 0; c < heldPiece.activeTetromino.length; c++) {
//             if (heldPiece.activeTetromino[r][c]) {
//                 drawSquareForHeldPiece(startingX + c, 6 * num + startingX + r, heldPiece.color);
//             }
//         }
//     }
// }




function generateRandomPieces() {
    // fill the future pieces array for upto 3 predictions
    while (futurePieces.length != 3) {
        let randomN = Math.floor(Math.random() * PIECES.length);
        futurePieces.push(new Piece(PIECES[randomN][0], PIECES[randomN][1]));
    }
}

futurePieces = [];

generateRandomPieces();
let p = futurePieces.shift();


// Create a piece

function Piece(Tetromino, color) {
    this.tetromino = Tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}


// Draw piece with given color

Piece.prototype.fill = function(color) {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.draw = function() {
    this.fill(this.color);
}


Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}


// Lock the piece in the board after bottom collision

Piece.prototype.lock = function() {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            } else if (this.y + r < 0) {
                // we will pause the current track , and set its volume to 0
                // we must fix the sound thing as well
                gameVolume = document.getElementById("song").volume;
				document.getElementById("song").volume = 0;
				
                document.getElementById('gameover').play();

                gameOver = true;
                document.getElementById('scoreDisp').innerHTML = score;
                document.getElementById('endOverlay').style.display = '';
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }

    // Remove full rows
    var lineCleared = 0
    for (var r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            for (var x = r; x > 1; x--) {
                for (var c = 0; c < COL; c++) {
                    board[x][c] = board[x - 1][c];
                }
            }
            
            for (var c = 0; c < COL; c++) {
                board[0][c] = VACANT;
                lineCleared += 1;
            }
            
        }
    }

    if (lineCleared){
        score += 10 * ((2 * lineCleared/COL) - 1);
        scoreElement.innerHTML = score;
    }

    drawBoard();
}


// Checks for collision of piece

Piece.prototype.collision = function(x, y, piece) {
    for (var r = 0; r < piece.length; r++) {
        for (var c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + x + c;
            let newY = this.y + y + r;
            if (newX < 0 || newX >= COL || newY >= ROW) {
                document.getElementById('blockLock').play();
                return true;
            } else if (newY < 0) {
                continue;
            } else if (board[newY][newX] != VACANT) {
                document.getElementById('blockLock').play();
                return true;
            }
        }
    }
    return false;
}

Piece.prototype.hardDrop = function(){
    while(!this.collision(0, 1, this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
}


Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        // drop new piece
        p = futurePieces.shift();
        generateRandomPieces();
        drawfuturePieces();
    }
}


Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}


Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.hold = function(){
    this.unDraw();
    p = futurePieces.shift();
    generateRandomPieces();
    drawfuturePieces();
}



Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    // Check if the next pattern is colliding before rotating

    // If the pattern is colliding with the on the walls, push it one unit away from the wall

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}



var paused = false;

document.getElementById("togglePause").addEventListener('click', togglePause);

// toggle play/pause
function togglePause() {
    paused = !paused;
    if (paused){
        document.getElementById("overlay").style.display = "block";
    }
    else{
        document.getElementById("overlay").style.display = "none";
    }
}


document.getElementById("newGame").addEventListener('click', startNewGame);


document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (!paused && !gameOver) {
        if (event.keyCode == 32){
            p.hardDrop();
        } else if (event.keyCode == 37) {
            p.moveLeft();
            // dropStart = Date.now();
        } else if (event.keyCode == 38) {
            p.rotate();
            // dropStart = Date.now();
        } else if (event.keyCode == 39) {
            p.moveRight();
            // dropStart = Date.now();
        } else if (event.keyCode == 40) {
            p.moveDown();
        } else if (event.keyCode == 67) {
            p.hold();
        }
    }
}


let dropStart = Date.now();


function drop() {
    if (!paused) {
        let now = Date.now();
        let delta = now - dropStart;

        // move the piece down every 1 sec

        if (delta > 1000) {
            p.moveDown();
            dropStart = Date.now();
        }
    }
    if (!gameOver) {
        requestAnimationFrame(drop); 
    }
}



trackId = 0;
music = [];
music[0] = "./music/song1.mp3";
music[1] = "./music/song2.mp3";

shuffleButton = document.getElementById('shuffleButton');
shuffleButton.addEventListener('click', function() {
    console.log("Button clicked")
    trackId = (trackId + 1) % music.length;
    document.getElementById('soundTrack').innerHTML = "<audio loop autoplay id='song'><source src=" + music[trackId] + " type='audio/ogg'>Your browser does not support the audio element.</audio>";
});



// starts new game. clears board, generates new next pieces and array
function startNewGame() {
    var btns = document.getElementsByClassName('btns');
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.display = '';
    }
    document.getElementById('scoreForm').style.display = 'none';
    document.getElementById('endOverlay').style.display = 'none';

    score = 0;
    scoreElement.innerHTML = 0;

    paused = false;
    gameOver = false;

    for (var r = 0; r < ROW; r++) {
        board[r] = [];
        for (var c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }

    drawBoard();

    drawAllNextPiecesBoard();
    drawHoldPieceBoard();

    //create the random piece array initiate a piece
    futurePieces = [];
    generateRandomPieces();

    // sets the first piece up
    p = futurePieces.shift();
    // fills the remaining futurePieces array which was empty(at last slot) due to above line
    generateRandomPieces();

    drawfuturePieces();

    timeElement.innerHTML = '00:00.0';
    mins = secs = decisecs = 0;

    drop();

}

startNewGame();


window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);



function changeBoardBackground(color) {
    for (var r = 0; r < ROW; r++) {
        for (var c = 0; c < COL; c++) {
            if (board[r][c] == color) {
                drawSquare(c, r, VACANT);
                board[r][c] = VACANT;
            }
        }
    }
    drawfuturePieces();
}


document.getElementById("themeToggle").addEventListener('click', themeToggle);

var theme = 1; //light

function themeToggle(){
    if (theme){
        document.body.style.backgroundImage = 'url(./assets/bgTetrisBlocks.jpg)';
        VACANT = 'black';
        lineColor = 'white';
        changeBoardBackground('aliceblue');
        document.getElementById('scoreOuter').style.color = 'white';  
        document.getElementById('timeOuter').style.color = 'white';       
        cvs.style.borderColor = 'white';
        fp1.style.borderColor = 'white'; 
        fp2.style.borderColor = 'white';
    } else {
        document.body.style.backgroundImage = 'url(./assets/bgTetrisBlocksLight.jpg)';
        VACANT = 'aliceblue';
        lineColor = 'black';
        changeBoardBackground('black');
        document.getElementById('scoreOuter').style.color = 'black'; 
        document.getElementById('timeOuter').style.color = 'black'; 
        cvs.style.borderColor = 'black';
        fp1.style.borderColor = 'black'; 
        fp2.style.borderColor = 'black';
    }
    theme = !theme;
}


// document.getElementById("themeAlt").addEventListener('click', themealt);
// function themealt(){
//     document.body.style.backgroundImage = 'url(./assets/background1.jpg)';
// }


// For volume control

function setVolume (val) {
    var player = document.getElementById('song');
    player.volume = val / 100;
    gameVolume = document.getElementById("song").volume;
}


// Implement timer 
setInterval(async function(){ 
    if (!paused && !gameOver) {
        decisecs += 1;
        if (decisecs == 10) {
            decisecs = 0;
            secs += 1;
        }
        if (secs == 60) {
            secs = 0;
            mins += 1;
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
    }
}, 100);


function showForm() {
    var btns = document.getElementsByClassName('btns');
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.display = 'none';
    }
    document.getElementById('scoreForm').style.display = 'block';
}


function scoreFormSubmit() {
    var formElt = document.getElementById('scoreForm');
    var scoreInp = document.getElementById('scoreInp');
    var timeInp = document.getElementById('timeInp');
    var timeElapsed = (mins * 60) + secs + (decisecs / 10.0);
    scoreInp.value = score;
    timeInp.value = timeElapsed;
    formElt.submit();
}

}catch(err) {
    alert(err);
}