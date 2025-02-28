window.onload = (event) => {
    alert("e")
};
var wHeight = window.innerHeight;
var wWidth = window.innerWidth;
const myRect = document.getElementById("myRectangle");
const ctx = myRect.getContext("2d");
var rectHeight = 100;
var rectWidth = 100;
var x = 2;
var y = 2;
var accelX = 0;
var accelY = 0;

myRect.height = 400;
myRect.width = 400;
ctx.fillStyle = "black";

setInterval(updateCanvas,1000);

document.addEventListener("keydown", (e) => {
    e = e || window.event;    
    if(e.key === "ArrowUp"){
        y -= 2;
    } else if(e.key === "ArrowDown"){
        y += 2;
    } else if(e.key === "ArrowRight"){
        x += 2;
    } else if(e.key === "ArrowLeft"){
        x -= 2;
    }
})

function updateCanvas(){
    ctx.clearRect(0, 0, myRect.width, myRect.height);
    ctx.beginPath();
    ctx.rect(x,y,rectWidth,rectHeight);
    ctx.stroke();
}
