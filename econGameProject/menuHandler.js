
//money breakdown GUI
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

//policy info GUI
function togglePolicyInformationScreen(){
    updatePolicyInformation();
    const policyInformationScrn = document.getElementById("policyInformationScreen");
    const currentVisibility = getComputedStyle(policyInformationScrn).visibility;
    const overlay = document.getElementById("policyInformationOverlay");
    // alert(currentVisibility);
    if(currentVisibility == "hidden"){
        policyInformationScrn.style.visibility = "visible";
        overlay.style.visibility = "visible";
    } else{
        policyInformationScrn.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
    }
}

function updatePolicyInformation(){
    const RRROutput = document.getElementById("RRRInfoOutput");
    const inflationPercentOutput = document.getElementById("recommendedInflationOutput");
    RRROutput.innerText = requiredReservesRatio*100 + "%";
    inflationPercentOutput.innerText = defaultInterest + "%";
}



//update customer info
function updateCustomerInfo(id){
    const nameOutput = document.getElementById("customerName");
    const loanAmtOutput = document.getElementById("customerLoanReqAmt");
    const trustworthynessOutput = document.getElementById("customerTrustworthynessRating");
    nameOutput.innerText = "Name: " + allCustomers[id].Name;
    loanAmtOutput.innerText = "Requested Amount: " + allCustomers[id].requestedAmount;
    trustworthynessOutput.innerText = "Trustworthyness: " + allCustomers[id].trustworthyPercent;
}
