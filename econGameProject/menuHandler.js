//toggles the money breakdown screen
function toggleMoneyBreakdownScreen(){
    updateMoneyBreakdown();
    const moneyBreakdownScreen = document.getElementById("moneyBreakdownScreen");
    const currentVisibility = getComputedStyle(moneyBreakdownScreen).visibility;
    const overlay = document.getElementById("moneyBreakdownOverlay");
    // alert(currentVisibility);
    if(currentVisibility == "hidden"){
        moneyBreakdownScreen.style.visibility = "visible";
        overlay.style.visibility = "visible";
    } else{
        moneyBreakdownScreen.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
    }
}

//updates the total money display in gui
function updateMoneyDisplay(){
    const totalBankOutput = document.getElementById("playerTotalMoneyDisplay");
    totalBankOutput.innerText = "Total Funds: $" + playerBank;
}

function updateMoneyBreakdown(){
    const requiredReservesText = document.getElementById("reservesTableRROutput");
    const excessReservesText = document.getElementById("reservesTableEROutput");
    calculateFunds();
    requiredReservesText.innerText = "$" + requiredReserves;
    excessReservesText.innerText = "$" + excessReserves;
}
