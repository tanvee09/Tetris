const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
const scoreElement = document.getElementById('score');

// instantiating 3 futurePiece Context
const fp1 = document.getElementById('futurePiece1');
const ctxfp1 = fp1.getContext('2d');

const fp2 = document.getElementById('futurePiece2');
const ctxfp2 = fp2.getContext('2d');

const fp3 = document.getElementById('futurePiece3');
const ctxfp3 = fp3.getContext('2d');

const ROW = 20;
const COL = 10;
const SQ = squareSize = 30;
const VACANT = 'black';


// Draw the square

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    // ctx.strokeStyle = color;
    // ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// Draws a particular Predicted piece
function drawSquareForNextPieces(x, y, color, num) {
    // num specifies which predicted shape it draws
    if (num == 0) {
        ctxfp1.fillStyle = color;
        ctxfp1.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctxfp1.strokeStyle = 'white';
        ctxfp1.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
    if (num == 1) {
        ctxfp2.fillStyle = color;
        ctxfp2.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctxfp2.strokeStyle = 'white';
        ctxfp2.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
    if (num == 2) {
        ctxfp3.fillStyle = color;
        ctxfp3.fillRect(x * SQ, y * SQ, SQ, SQ);

        ctxfp3.strokeStyle = 'white';
        ctxfp3.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
}


// Create board

let board = [];
var score = 0;

for (var r = 0; r < ROW; r++) {
    board[r] = [];
    for (var c = 0; c < COL; c++) {
        board[r][c] = VACANT;
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

drawBoard();

function drawAllNextPiecesBoard() {
    for (var num = 0; num < 3; num++) {
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 4; c++) {
                drawSquareForNextPieces(c, r, VACANT, num);
            }
        }
    }
}

drawAllNextPiecesBoard();


const PIECES = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'cyan'],
    [O, 'indigo'],
    [I, 'yellow'],
    [L, 'purple'],
    [J, 'orange']
];


//

futurePieces = [];

function generateRandomPieces() {
    // fill the future pieces array for upto 3 predictions
    while (futurePieces.length != 3) {
        let randomN = Math.floor(Math.random() * PIECES.length);
        futurePieces.push(new Piece(PIECES[randomN][0], PIECES[randomN][1]));
    }
}


//create the random piece array initiate a piece
generateRandomPieces();

// sets the first piece up
let p = futurePieces.shift();
// fills the remaining futurePieces array which was empty(at last slot) due to above line
generateRandomPieces();

function drawfuturePieces() {
    drawAllNextPiecesBoard();
    for (var num = 0; num < 3; num++) {
        let nextPiece = futurePieces[num];
        for (var r = 0; r < nextPiece.activeTetromino.length; r++) {
            for (var c = 0; c < nextPiece.activeTetromino.length; c++) {
                if (nextPiece.activeTetromino[r][c]) {
                    drawSquareForNextPieces(c, r, nextPiece.color, num);
                }
            }
        }
    }
}

drawfuturePieces();

// Create a piece

function Piece(Tetromino, color) {
    this.tetromino = Tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}


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

Piece.prototype.lock = function() {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            } else if (this.y + r < 0) {
                alert(`Game Over! Your score is ${score}.`);
                gameOver = true;
                break;
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }

    // Remove full rows
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
            }
            score += 10;
            scoreElement.innerHTML = score;
        }
    }

    drawBoard();
}


Piece.prototype.collision = function(x, y, piece) {
    for (var r = 0; r < piece.length; r++) {
        for (var c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }
            let newX = this.x + x + c;
            let newY = this.y + y + r;
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            } else if (newY < 0) {
                continue;
            } else if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}


Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
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



Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

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



document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}


let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();