//players banking info
var playerBank = 100;
var requiredReserves;
var excessReserves;

//policy requirements
var requiredReservesRatio = 0.10;
var defaultInterest = 5;

//loan tracking
var loanedFunds = 0;

function generateRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function calculateFunds(){
    requiredReserves = playerBank*requiredReservesRatio;
    excessReserves = playerBank-requiredReserves;
}


updateMoneyDisplay();
