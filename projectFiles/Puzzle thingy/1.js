const button = document.getElementById("TheButton");
var screenSize = {x: window.innerWidth, y: window.innerHeight};
var buttonMovedTimes = 0;

function clickedButton(){
    if(buttonMovedTimes < 5){
        buttonMovedTimes++;
        moveButton();
    } else{
        document.getElementById("hyperlink").style.visibility = "visible";
    }
}

function genRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveButton(){
    let newX = genRandom(0, screenSize.x);
    let newY = genRandom(0, screenSize.y);
    button.style.position = "absolute";
    button.style.left = newX;
    button.style.top = newY;
}