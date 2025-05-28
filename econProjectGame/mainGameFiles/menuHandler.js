const arrowKeys = document.getElementById("arrowKeys");
const checkAndX = document.getElementById("checkAndDenyButtons");
const outputScroll = document.getElementById("outputScrollText");
var curViewingLoan = 0;
var customersServed = 0;

function clearPreviousScroll(){
    toggleArrowKeys(false);
    toggleCheckAndX(false);
    while(outputScroll.children.length > 0){
        outputScroll.removeChild(outputScroll.lastChild);
    }
}

function displayRunInfo(){
    clearPreviousScroll();
    let strings = ["Day: ", "Customers Served: ", "Total Bank: "];
    for(let i = 0; i < 3; i++){
      let newText = document.createElement("p");
      let newStr = strings[i];
      switch(i){
        case 0:
          newStr += day + "\n";
          break;
        case 1:
          newStr += customersServed + "\n";
          break;
        case 2:
          newStr += "$" + truncNum(playerBank,2) + "\n";
          break;
      }
      newText.innerText = newStr;
      newText.classList.add("scrollText");
      newText.style.width = "250px";
      outputScroll.appendChild(newText);
    }
    
}

function displayCustomerInfo(){
    clearPreviousScroll();
    toggleCheckAndX(true);
    //scrolls through all 4 things the player needs to know
    if(unservedCustomers.length !== 0){
      let strings = ["Name: ", "Request Amt: ", "Interest: "]
      for(let i = 0; i < 3; i++){
          let curCustomer = allCustomers[getCustomerId(unservedCustomers[0])];
          let newParagraph = document.createElement("p");
          let tempStr = "";
          tempStr += strings[i];
          switch(i){
              case 0:
                  tempStr += curCustomer.Name;
                  break;
              case 1:
                  tempStr += curCustomer.requestedAmount;
                  break;
              case 2:
                  tempStr += curCustomer.interestPercent;
                  break;
          }
          newParagraph.innerText += tempStr + "\n";
          newParagraph.classList.add("scrollText");
          newParagraph.style.width = "250px";
          outputScroll.appendChild(newParagraph);
      }
    } else{
      let newText = document.createElement("p");
      newText.innerText = "No New Customers..";
      newText.classList.add("scrollText");
      newText.style.width = "250px";
      outputScroll.appendChild(newText);
    }
    
}

function displayFundsInfo(){
    clearPreviousScroll();
    calculateFunds();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "Excess Reserves: $" + truncNum(excessReserves,2) + "\n\nRequired Reserves: $" + truncNum(requiredReserves,2);
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "250px";
    outputScroll.appendChild(newInfoBox);
}

function attemptViewLoan(dir){
  if(curViewingLoan + dir >= accruedLoans.length || curViewingLoan + dir < 0){
    
  } else{
    curViewingLoan += dir;
    displayLoansInfo(curViewingLoan);
  }
}

function displayLoansInfo(id){
    clearPreviousScroll();
    toggleArrowKeys(true);
    if(accruedLoans.length === 0){
      let newText = document.createElement("p");
      newText.innerText = "No Outward Loans";
      newText.classList.add("scrollText");
      outputScroll.appendChild(newText);
    } else{
      let curCustomer = allCustomers[getCustomerId(accruedLoans[id].belongsToCustomerId)];
      let strings = ["Name: ", "Initial Value: ", "Current Value: ", "Interest: ", "Days Left: "];
      for(let i = 0; i < 5; i++){
        let newText = document.createElement("p");
        let newStr = strings[i];
        switch(i){
          case 0:
            newStr += curCustomer.Name + "\n";
            break;
          case 1:
            newStr += curCustomer.requestedAmount + "\n";
            break;
          case 2:
            newStr += accruedLoans[id].currentAmount + "\n";
            break;
          case 3:
            newStr += curCustomer.interestPercent + "\n";
            break;
          case 4:
              newStr += accruedLoans[id].daysTillCollection + "\n";
        }
        newText.classList.add("scrollText");
        newText.innerText = newStr;
        newText.style.width = "200px";
        outputScroll.appendChild(newText);
      }
    }
}

function displayPolicyInfo(){
    clearPreviousScroll();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "Required Reserve Ratio: " + requiredReservesRatio;
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "200px";
    let newInfo2 = document.createElement("p");
    newInfo2.innerText = "\nDefault Interest: " + defaultInterest;
    newInfo2.classList.add("scrollText");
    newInfo2.style.width = "200px";
    outputScroll.appendChild(newInfoBox);
    outputScroll.appendChild(newInfo2);
}

function toggleArrowKeys(onoff){
  //inverse
  if(onoff){
    arrowKeys.style.visibility = "visible";
  } else {
    arrowKeys.style.visibility = "hidden";
  }
}

function toggleCheckAndX(onoff){
  if(onoff){
    checkAndX.style.visibility = "visible";
  } else{
    checkAndX.style.visibility = "hidden";
  }
}

function displayTutorial(){
  clearPreviousScroll();
  alert("To win you have to get a total bank value of 10000$! But if you go below $0, you lose! You can check your excess reserves in the [funds] menu! Buttons will pop up as needed, and loans are collected automatically, have fun! (pro tip: hit alt)");
  alert("Side Note: I highly recommend playing in fullscreen (on windows keyboard hit [f11]) so that the page will format properly");
}