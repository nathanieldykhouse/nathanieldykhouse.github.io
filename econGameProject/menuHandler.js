
const outputScroll = document.getElementById("outputScrollText")

function clearPreviousScroll(){
    while(outputScroll.children.length > 0){
        outputScroll.removeChild(outputScroll.lastChild);
    }
}

function displayRunInfo(){
    clearPreviousScroll();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "run info stuff";
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "200px";
    outputScroll.appendChild(newInfoBox);
}

function displayCustomerInfo(){
    clearPreviousScroll();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "customer info stuff";
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "200px";
    outputScroll.appendChild(newInfoBox);
}

function displayFundsInfo(){
    clearPreviousScroll();
    calculateFunds();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "Excess Reserves: $" + excessReserves + "\n\nRequired Reserves: $" + requiredReserves;
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "250px";
    outputScroll.appendChild(newInfoBox);
}

function displayLoansInfo(){
    clearPreviousScroll();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "loans info stuff";
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "200px";
    outputScroll.appendChild(newInfoBox);
}

function displayPolicyInfo(){
    clearPreviousScroll();
    let newInfoBox = document.createElement("p");
    newInfoBox.innerText = "Required Reserve Ratio: " + requiredReservesRatio;
    newInfoBox.classList.add("scrollText");
    newInfoBox.style.width = "200px";
    outputScroll.appendChild(newInfoBox);
}