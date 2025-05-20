var allCustomers = [];

var firstNames = ["Jane", "John", "Jack"];
var lastNames = ["Smith", "Taylor", "House"];

function generateLoanRequestAmt(financialStatus){
    switch(financialStatus){
        case 0:
            return generateRandom(5, 100);
        case 1:
            return generateRandom(100, 500);
        case 2:
            return generateRandom(500, 2000);
    }
}

function generateNewCustomer(){
    let firstName = firstNames[generateRandom(0, firstNames.length)];
    let lastName = lastNames[generateRandom(0, lastNames.length)];
    let fullName = firstName + " " + lastName;
    //0 - poor, 1 - middle income, 2 - rich
    let financialStatus = generateRandom(0,2);
    let loanRequestAmt = generateLoanRequestAmt(financialStatus);
    let requestedInterest = defaultInterest;
    let trustworthyness = generateRandom(1,100);
    const customer = {
        Name: fullname,
        requestedAmount: loanRequestAmt,
        trustworthyPercent: trustworthyness
    };
    allCustomers.push(customer);
}
