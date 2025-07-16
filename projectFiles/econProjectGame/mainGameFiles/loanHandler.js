const playerLoanInfo = {
  interestPercent: 0
};
const requestedInflationPercentOutput = document.getElementById("playerInflationSet");
var defLoanOp = 0;
const accruedLoans = [];
const loansToCollect = [];

function resetLoanOptions(defaultInt){
  defLoanOp = defaultInt;
  playerLoanInfo.interestPercent = defLoanOp;
  requestedInflationPercentOutput.innerText = "Interest: " + playerLoanInfo.interestPercent + "%";
}

function changeRequestedInflation(amt){
  if(amt == 1 && playerLoanInfo.interestPercent < 100){
      playerLoanInfo.interestPercent += 1;
  } else if(amt == -1 && playerLoanInfo.interestPercent > 0){
      playerLoanInfo.interestPercent -= 1;
  }
  requestedInflationPercentOutput.innerText = "Interest: " + playerLoanInfo.interestPercent + "%";
}

//calculate the total balance of the player (in here for ease of access)
function calcTotalBal(){
  var totalBal = 0;
  totalBal += playerBank;
  for(let i = 0; i < accruedLoans.length; i++){
      let initialAmt = accruedLoans[i].initialAmount;
      totalBal += initialAmt;
  }
  for(let i = 0; i < loansToCollect.length; i++){
      totalBal += loansToCollect.initialAmount;
  }
  return totalBal;
}


//make or reject loans
function makeLoan(){
  calculateFunds();
  let customer = allCustomers[getCustomerId(unservedCustomers[0])];
  if(excessReserves >= customer.requestedAmount){
      customer.interestPercent = playerLoanInfo.interestPercent;
      var loan = {
          initialAmount: customer.requestedAmount,
          interestPerDay: customer.interestPercent,
          daysTillCollection: 0,
          currentAmount: customer.requestedAmount,
          belongsToCustomerId: 0
      };
      loan.belongsToCustomerId = unservedCustomers[0];
      loan.daysTillCollection = generateRandom(1, 5);
      playerBank -= customer.requestedAmount;
      accruedLoans.push(loan);
      unservedCustomers.splice(0,1);
      displayCustomerInfo(unservedCustomers[0]);
  } else{
      alert("Not enough funds :(");
  }
}

function rejectLoan(){
  let custId = getCustomerId(unservedCustomers[0]);

  if(custId < 0){
      alert("couldn't find customer");
  } else{
      allCustomers.splice(custId, 1);
      unservedCustomers.splice(0,1);
  }
  displayCustomerInfo(0);
}


//clear loansToCollect
function collectOutstandingLoans(){
  let amtCollected = 0;
  let amtCustomersRecovered = 0;
  while(loansToCollect.length > 0){
    let curCustomer = getCustomerId(loansToCollect[0].belongsToCustomerId);
    playerBank += truncNum(loansToCollect[0].currentAmount, 2);
    amtCollected += truncNum(loansToCollect[0].currentAmount, 2);
    amtCustomersRecovered++;
    allCustomers.pop(curCustomer);
    loansToCollect.pop()
  }
  customersServed += amtCustomersRecovered;
  alert("collected [$" + amtCollected + "] from [" + amtCustomersRecovered + "] Customers!");
}

//increment loans
function incrementAllLoans(){
  for(let i = 0; i < accruedLoans.length; i++){
      let currentLoan = accruedLoans[i];
      let intPerc = currentLoan.interestPerDay;
      let newLoanVal = currentLoan.currentAmount*(intPerc/100);
      currentLoan.currentAmount += newLoanVal;
      currentLoan.daysTillCollection--;
      if(currentLoan.daysTillCollection == 0){
          loansToCollect.push(currentLoan);
          accruedLoans.splice(i, 1);
      }
  }
  if(loansToCollect.length > 0){
      collectOutstandingLoans(loansToCollect);
  }
}

