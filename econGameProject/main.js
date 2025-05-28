//players banking info
var playerBank = 100;
var requiredReserves;
var excessReserves;

//policy requirements
var requiredReservesRatio = 0.10;
var defaultInterest = 5;
var interestChange = 0;

//loan tracking
var loanedFunds = 0;

//daycounter
var day = 0;

//key input
document.addEventListener('keydown', function(event){
    let key = event.key;
    if(key === "Alt" && event.location == 2){
        alert("Hello, Mrs. Moore!");
    }
    if(key == "1"){
        generateNewCustomer();
    } else if(key == "2"){
        alert(allCustomers.length);
    }
})

//generate a random number (inclusive)
function generateRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}



//calculate players total available funds
function calculateFunds(){
    let totBal = calcTotalBal();
    requiredReserves = totBal*requiredReservesRatio;
    excessReserves = playerBank-requiredReserves;
}

//go to the next day
function nextDay(){
    day++;
    let incOrDec = generateRandom(0,1);
    let amt = generateRandom(1,2);
    if(incOrDec == 0){
        defaultInterest-=amt;
    } else{
        defaultInterest+=amt;
    }
    for(let i = 0; i < 3; i++){
        generateNewCustomer();
    }
    const dayDisplay = document.getElementById("curDayDisplay");
    dayDisplay.innerText = "Day: " + day;
    incrementAllLoans();
    updateMoneyDisplay();
    updateCustomerInfo(unservedCustomers[0]);
}

//truncate to decimal place
function truncNum(num, decimals){
    const fac = Math.pow(10, decimals);
    return Math.trunc(num * fac)/fac;
}

//excessReserves get
function getExcessReserves(){
    calculateFunds();
    return excessReserves;
}

//automatically render sprite sizes
function testAlert(){
    alert("hit the image, yup");
}

//starting commands
nextDay();
resetLoanOptions(defaultInterest);