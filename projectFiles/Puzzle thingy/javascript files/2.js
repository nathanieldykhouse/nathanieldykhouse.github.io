const button = document.getElementById("TheButton");
var screenSize = {x: window.innerWidth, y: window.innerHeight};
var buttonClickedTimes = 0;
var buttonVX = 0;
var buttonVY = 0;
var buttonX = 250;
var buttonY = 250;
const maxV = 5;

function clickedButton(){
    if(buttonClickedTimes < 5){
        buttonClickedTimes++;
        randomizeVelocity();
    } else{
        document.getElementById("hyperlink").style.visibility = "visible";
    }
}

function genRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeVelocity(){
    buttonVX = genRandom(maxV*-1, maxV);
    buttonVY = genRandom(maxV*-1, maxV);
}

function moveButton(){
    buttonX = buttonX + buttonVX;
    buttonY = buttonY + buttonVY;

    if (buttonX < 0 || buttonX > screenSize.x) {
        buttonVX *= -1;
    }
    if (buttonY < 0 || buttonY > screenSize.y) {
        buttonVY *= -1;
    }

    button.style.left = buttonX + "px";
    button.style.top = buttonY + "px";

    requestAnimationFrame(moveButton);
}

requestAnimationFrame(moveButton);