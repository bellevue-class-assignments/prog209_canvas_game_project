// Create the canvas
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

// player movement related constants
const DOWN = 0;
const DOWN_RIGHT = 1;
const RIGHT = 2;
const UP_RIGHT = 3;
const UP = 4;
const UP_LEFT = 5;
const LEFT = 6;
const DOWN_LEFT = 7;
const FRAME_LIMIT = 16;

// Audio
let explosion = new Audio('audio/explosion.mp3');
let backgroundMusic = new Audio('audio/background_music.mp3');
let victorySound = new Audio('audio/victory.mp3');
let failureSound = new Audio('audio/boos3.mp3');

// Timer stuff
let start = true; // flags that you want the countdown to start
let stopIn = 60000; // how long the timer should run
let stopTime = 0; // used to hold the stop time
let stop = false; // flag to indicate that stop time has been reached
let timeTillStop = 0; // holds the display time
let timesUp = false;

// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = 'images/background.png';

let brdrReady = false;
let brdrImage = new Image();
brdrImage.onload = () => {
    brdrReady = true;
};
brdrImage.src = 'images/radiation_border.png';

// border image L-R
let blReady = false;
let blImage = new Image();
blImage.onload = function() {
    blReady = true;
};
blImage.src = 'images/BorderLeft.jpg';

// border image T-B
let btReady = false;
let btImage = new Image();
btImage.onload = function() {
    btReady = true;
};
btImage.src = 'images/BorderTop.jpg';



// player image
let playerReady = false;
let playerImage = new Image();
playerImage.onload = () => {
    playerReady = true;
};
playerImage.src = 'images/player.png';


// target image
let targetReady = false;
let targetImage = new Image();
targetImage.onload = function() {
    targetReady = true;
};

targetImage.src = 'images/target.png';

// target destroyed image
let destroyedReady = false;
let destroyedImage = new Image();
destroyedImage.onload = function() {
    destroyedReady = true;
};

destroyedImage.src = 'images/destroyed.png';

// Game objects
// Player object
let player = {
    speed: 64, // movement in pixels per second
    x: 0,
    y: 0,
    height: 64,
    width: 64,
    direction: DOWN,
    frame: 0,
    moved: false
};

// Target object
let target = {
    x: 0,
    y: 0
};

// Destroyed object
let destroyed = {
    x: 0,
    y: 0
}

// Targets caught
let targetsCaught = 0;
let killCount = 5;


// Handle keyboard controls
let keysDown = {}; // object were we add up to 4 properties when keys go down
// and then delete them when the key goes up


addEventListener('keydown', function(e) {
    keysDown[e.key] = true;
}, false);

addEventListener('keyup', function(e) {
    delete keysDown[e.key];
}, false);

// Reset the game when the player catches a target
let reset = function() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;


    if (targetsCaught === killCount || timesUp) {
        for (i = 0; i <= 150; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 6);
            let dy = (Math.random() - 0.5) * (Math.random() * 6);
            let radius = Math.random() * 3;
        }
    } else {
        //Place the target somewhere on the screen randomly
        target.x = 32 + (Math.random() * (canvas.width - 150));
        target.y = 32 + (Math.random() * (canvas.height - 148));
    }
};

// Update game objects
let update = (modifier, now) => {

    if (start) { // do we need to start the timer
        stopTime = now + stopIn; // yes the set the stoptime
        start = false; // clear the start flag


    } else { // waiting for stop
        if (now >= stopTime) { // has stop time been reached?
            start = true;
            timesUp = true;
        }
    }

    timeTillStop = stopTime - now; // for display of time till stop

    if ('PageUp' in keysDown) { // Player holding up-right
        player.x += player.speed * modifier;
        player.y -= player.speed * modifier;
        player.direction = UP_RIGHT;
        player.moved = true;

        if (player.x > (1000 - (32 + 55))) {
            player.x = 1000 - (32 + 55);
        }

        if (player.y < (32)) {
            player.y = 32;
        }
    } else if ('PageDown' in keysDown) { // Player holding down-right
        player.x += player.speed * modifier;
        player.y += player.speed * modifier;
        player.direction = DOWN_RIGHT;
        player.moved = true;

        if (player.x > (1000 - (32 + 55))) {
            player.x = 1000 - (32 + 55);
        }

        if (player.y > (1000 - (81))) {
            player.y = 1000 - 81;
        }
    } else if ('End' in keysDown) { // Player holding down-left
        player.x -= player.speed * modifier;
        player.y += player.speed * modifier;
        player.direction = DOWN_LEFT;
        player.moved = true;

        if (player.x < (21)) {
            player.x = 21;
        }

        if (player.y > (1000 - (81))) {
            player.y = 1000 - 81;
        }
    } else if ('Home' in keysDown) { // Player holding up-left
        player.x -= player.speed * modifier;
        player.y -= player.speed * modifier;
        player.direction = UP_LEFT;
        player.moved = true;

        if (player.x < (21)) {
            player.x = 21;
        }

        if (player.y < (32)) {
            player.y = 32;
        }
    } else if ('ArrowLeft' in keysDown ||
        'a' in keysDown ||
        'A' in keysDown) { // Player holding left
        player.x -= player.speed * modifier;
        player.direction = LEFT;
        player.moved = true;
        if (player.x < (21)) {
            player.x = 21;

        }
    } else if ('ArrowUp' in keysDown ||
        'w' in keysDown ||
        'W' in keysDown) { // Player holding up
        player.y -= player.speed * modifier;
        player.direction = UP;
        player.moved = true;
        if (player.y < (32)) {
            player.y = 32;
        }

    } else if ('ArrowRight' in keysDown ||
        'd' in keysDown ||
        'D' in keysDown) { // Player holding right
        player.x += player.speed * modifier;
        player.direction = RIGHT;
        player.moved = true;
        if (player.x > (1000 - (32 + 55))) {
            player.x = 1000 - (32 + 55);
        }
    } else if ('ArrowDown' in keysDown ||
        's' in keysDown ||
        'S' in keysDown) { // Player holding down
        player.y += player.speed * modifier;
        player.direction = DOWN;
        player.moved = true;
        if (player.y > (1000 - (81))) {
            player.y = 1000 - 81;
        }
    } else { player.moved = false; }

    if (player.moved) {
        player.frame++;
        if (player.frame >= FRAME_LIMIT) {
            player.frame = 0;
        }
    }


    // Are they touching?
    //55 w  60 h
    // station 83 w 81 h
    if (
        player.x + 5 <= (target.x + 81) &&
        target.x <= (player.x + 55) &&
        player.y <= (target.y + 83) &&
        target.y <= (player.y + 52)
    ) {
        ++targetsCaught;
        explosion.play();
        reset();
    }
};

// Draw everything
let render = () => {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (btReady) {
        for (let i = 0; i < 1000; i = i + 40) {
            ctx.drawImage(brdrImage, i, 0);
            ctx.drawImage(brdrImage, i, 1000 - 32);
        }
    }

    if (blReady) {
        for (let i = 0; i < 1000; i = i + 40) {
            ctx.drawImage(brdrImage, 0, i);
            ctx.drawImage(brdrImage, 1000 - 32, i);
        }
    }


    if (playerReady) {
        drawPlayer(player.frame, player.direction);
    }

    if (targetReady) {
        ctx.drawImage(targetImage, target.x, target.y);
    }

    // Time
    let timeMessage
    ctx.fillStyle = 'rgp(250, 250, 250)';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    if (timesUp) {
        timeMessage = 'Time Remaining: 0:00';
    } else {
        timeMessage = 'Time Remaining: ' + millisToMinutesAndSeconds(timeTillStop);
    }


    ctx.fillText(timeMessage, 1000 - 32 - timeMessage.length, 32);

    // Score
    let scoreMessage = 'Space Stations Destroyed: ' + targetsCaught;
    ctx.fillStyle = 'rgb(250, 250, 250)';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if (timesUp) {
        scoreMessage = 'Out of time. YOU LOST!';
        failureSound.play();
        alert('You\'ve run Out of time!');
    } else if (targetsCaught === killCount) {
        scoreMessage = 'YOU WON!';
        victorySound.play();
        alert('You\'ve Won!');
    }
    ctx.fillText(scoreMessage, 32, 32);
};

// The main game loop
let main = () => {
    let now = Date.now();
    let delta = now - then;
    update(delta / 1000, now);
    render();
    then = now;

    if (targetsCaught < killCount && !timesUp) {
        // keep background music playing...
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
        requestAnimationFrame(main);
    }
};

// Cross-browser support for requestAnimationFrame
//let w = window;
//requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
reset();
main();

function drawPlayer(frameX, frameY) {
    ctx.drawImage(playerImage,
        frameX * player.width, frameY * player.height, player.width, player.height,
        player.x, player.y, 64, 64);
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}