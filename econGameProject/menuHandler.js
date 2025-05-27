
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
    calcTotalBal();
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
    let custId = -1; 
    for(let i = 0; i < allCustomers.length; i++){
        if(allCustomers[i].id == id){
            custId = i;
        }
    }
    nameOutput.innerText = "Name: " + allCustomers[custId].Name;
    loanAmtOutput.innerText = "Requested Amount: " + allCustomers[custId].requestedAmount;
    trustworthynessOutput.innerText = "Trustworthyness: " + allCustomers[custId].trustworthyPercent;
}

//loan info screen
function toggleLoanInformationScreen(){
    updateLoanInfoScreen();
    const loansInformationScreen = document.getElementById("loansInformationScreen");
    const loanOutputOverlay = document.getElementById("loanInformationOverlay");
    const currentVisibility = getComputedStyle(loansInformationScreen).visibility;
    if(currentVisibility == "hidden"){
        loansInformationScreen.style.visibility = "visible";
        loanOutputOverlay.style.visibility = "visible";
    } else{
        loansInformationScreen.style.visibility = "hidden";
        loanOutputOverlay.style.visibility = "hidden";
    }
    
}

function displayNoNewCustomer(){
    const nameOutput = document.getElementById("customerName");
    const loanAmtOutput = document.getElementById("customerLoanReqAmt");
    const trustworthynessOutput = document.getElementById("customerTrustworthynessRating");
    nameOutput.innerText = "No Customers";
    loanAmtOutput.innerText = "--";
    trustworthynessOutput.innerText = "--";
}

function updateLoanInfoScreen(){
    //requirements: add dynamic amount of rows for each loan, add in the appropriate information for each loan
    const tableBody = document.getElementById("activeLoansTableBody");
    //delete old rows
    while(tableBody.children.length > 0){
        tableBody.removeChild(tableBody.lastChild);
    }
    //add the new rows
    let n = accruedLoans.length;
    for(let i = 0; i < n; i++){
        let curLoan = accruedLoans[i];
        let customerId = getCustomerId(curLoan.belongsToCustomerId);
        let curCustomer = allCustomers[customerId];
        let newRow = document.createElement("tr");
        let newNameCell = document.createElement("th");
        newNameCell.innerText = curCustomer.Name;
        newRow.appendChild(newNameCell);
        let newInitLoansCell = document.createElement("th");
        newInitLoansCell.innerText = curLoan.initialAmount;
        newRow.appendChild(newInitLoansCell);
        let newCurrentValueCell = document.createElement("th");
        newCurrentValueCell.innerText = curLoan.currentAmount;
        newRow.appendChild(newCurrentValueCell);
        let newInterestRateCell = document.createElement("th");
        newInterestRateCell.innerText = curLoan.interestPerDay + "%";
        newRow.appendChild(newInterestRateCell);
        let newDaysRemainingCell = document.createElement("th");
        newDaysRemainingCell.innerText = curLoan.daysTillCollection;
        newRow.appendChild(newDaysRemainingCell);
        tableBody.appendChild(newRow);
    }
}

//loan collections screen
function collectOutstandingLoansScreen(loanstc){
    alert("collectOutstandingLoansScreen");
    if(loanstc.length > 0){
        alert("loanstc > 0")
        const collectedLoansOutput = document.getElementById("collectedLoansOutput");
        alert("got the output");
        while(collectedLoansOutput.children.length > 0){
            collectedLoansOutput.removeChild(collectedLoansOutput.lastChild);
        }
        alert("deleted previous information");
        for(let i = 0; i < loanstc.length; i++){
            let curLoan = loanstc[i];
            let customer = allCustomers[getCustomerId(curLoan.belongsToCustomerId)];
            let newRow = document.createElement("tr");
            //create a new cell that contains the customers name and appends it to newRow
            let newNameCell = document.createElement("th");
            newRow.appendChild(newNameCell);
            newNameCell.innerText = customer.Name;
            //same as new name cell but for the initial value
            let newInitValOutputCell = document.createElement("th");
            newInitValOutputCell.innerText = curLoan.initialAmount;
            newRow.appendChild(newInitValOutputCell);
            //same as both above but for ending value cell
            let newEndingValOutputCell = document.createElement("th");
            newEndingValOutputCell.innerText = truncNum(curLoan.currentAmount, 2);
            newRow.appendChild(newEndingValOutputCell);
            //appends new row to the collected loans output
            collectedLoansOutput.appendChild(newRow);
        }
        let accumulatedGain = 0;
        for(let i = 0; i < loanstc.length; i++){
            let curLoan = loanstc[i];
            accumulatedGain += curLoan.currentAmount;
        }
        const valueOutput = document.getElementById("totalGainOutput");
        valueOutput.innerText = "Total Gain: " + truncNum(accumulatedGain, 2);
        //makes the breakdown visible
        const collectedLoansOutputScreen = document.getElementById("collectedLoansDisplay");
        const collectedLoansOutputOverlay = document.getElementById("collectedLoansOverlay");
        playerBank += accumulatedGain;
        collectedLoansOverlay.style.visibility = "visible";
        collectedLoansOutputScreen.style.visibility = "visible";
    }
}

//hide the collected loans overlay
function hideCollectedLoans(){
    const collectedLoansOutputScreen = document.getElementById("collectedLoansDisplay");
    const collectedLoansOverlay = document.getElementById("collectedLoansOverlay");
    collectedLoansOutputScreen.style.visibility = "hidden";
    collectedLoansOverlay.style.visibility = "hidden";
    clearCollectedLoans();
}
