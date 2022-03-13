const CELL_SIZE = 20;
//Set canvas size menjadi 400
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
// Pengaturan Speed (semakin kecil semakin cepat)
let MOVE_INTERVAL = 190;
let lifeSnake = 3;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        //nyawa
        life: 3,
        level: 1
    }
}
let snake = initSnake("green");

// make apples array
let apples = [{
    color: "red",
    position: initPosition(),
},
{
    color: "blue",
    position: initPosition(),
}]

let life = {
    position: initPosition()
}

function drawCell(ctx, x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;

    ctx.arc(x * CELL_SIZE + 10, y * CELL_SIZE + 10, CELL_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
}

// level board
function drawLevel(snake) {
    let levelCanvas;
    levelCanvas = document.getElementById("levelBoard");
    let levelCtx = levelCanvas.getContext("2d");

    levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    levelCtx.font = "20px Arial";
    levelCtx.fillText("Level " + snake.level, 30, levelCanvas.scrollHeight / 2);
}

//life board
function drawLife(snake) {
    let lifeCanvas;
    lifeCanvas = document.getElementById("lifeBoard");
    let lifeCtx = lifeCanvas.getContext("2d");
    let lifeX = 10;
    let lifeY = 5;
    let cell = 15;
    lifeCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for(let i = 1; i <= snake.life; i++){
        var img = document.getElementById("life");
        if(i%11==0){
            lifeY+=25;
            lifeX = 10
        }
        lifeCtx.drawImage(img, lifeX, lifeY, cell, cell);
        lifeX+=20;
    }
}

function drawScore(snake) {
    let scoreCanvas;
    scoreCanvas = document.getElementById("score1Board");
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillText("Score", 10, 20);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 30, 50, scoreCanvas.scrollHeight / 2);
    
}

function drawSpeed(snake) {
    let speedCanvas;
    speedCanvas = document.getElementById("score2Board");
    let speedCtx = speedCanvas.getContext("2d");
    speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedCtx.font = "15px Arial";
    speedCtx.fillText("Kecepatan", 15, 35);
    speedCtx.font = "20px Arial";
    speedCtx.fillStyle = snake.color
    speedCtx.fillText(MOVE_INTERVAL + "ms", 20, 60);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        var snakeHead = document.getElementById("head-snake");
        ctx.drawImage(
            snakeHead,
            snake.head.x * CELL_SIZE,
            snake.head.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
        );

        for (let i = 1; i< snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            // DrawImage apple dan gunakan image id:
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        let prima = 0;
        for(let k = 1; k <= snake.score; k++){
            if(snake.score%k==0){
                prima++;
            }
        }
        if(prima == 2){
            var img = document.getElementById("life");
            ctx.drawImage(img, life.position.x * CELL_SIZE, life.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);    
        }

        drawLevel(snake);
        drawScore(snake);
        drawSpeed(snake);
        drawLife(snake);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

// Jadikan apples array
function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        var audiolevel = new Audio('./assets/level.mp3');
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            var audio = new Audio('./assets/eat-apple.wav');
            audio.play();
            apple.position = initPosition();
            snake.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});

            if(snake.score%5==0 && snake.level < 5){
                audiolevel.play();
                snake.level++;
                MOVE_INTERVAL-=30;
            } 
        }
    }
}

// dapat nyawa
function couldLife(snake, life) {
    if (snake.head.x == life.position.x && snake.head.y == life.position.y) {
        life.position = initPosition();
        snake.score++;
        snake.life++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
    couldLife(snake, life);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
    couldLife(snake, life);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
    couldLife(snake, life);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
    couldLife(snake, life);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        // Add game over audio:
        var audio = new Audio('./assets/game-over.mp3');
        var audioDefeat = new Audio('assets/defeat.mp3');
        snake.life--;
        if(snake.life!=0){
            audio.play();
        }

        if(snake.life == 0){
            audioDefeat.play();
            alert("Game over");
            snake = initSnake("green");
            MOVE_INTERVAL = 190
        }
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
   
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake);
}

initGame();