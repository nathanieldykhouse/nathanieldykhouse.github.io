const playerLoanInfo = {
    interestPercent: 0
};
const requestedInflationPercentOutput = document.getElementById("playerInflationSet");
var defLoanOp = 0;

function resetLoanOptions(defaultInt){
    defLoanOp = defaultInt;
    playerLoanInfo.interestPercent = defLoanOp;
    requestedInflationPercentOutput.innerText = playerLoanInfo.interestPercent + "%";
}

function changeRequestedInflation(amt){
    if(amt == 1){
        playerLoanInfo.interestPercent += 1;
    } else{
        playerLoanInfo.interestPercent -= 1;
    }
    requestedInflationPercentOutput.innerText = playerLoanInfo.interestPercent + "%";
}
