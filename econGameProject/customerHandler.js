var allCustomers = [];
var unservedCustomers = [];

var firstNames = ["Jane", "John", "Jack", "Kaitlyn", "Adam", "Sarah", "Mr.", "Mrs.", "Aragorn", "Legolas", "Bruce"];
var lastNames = ["Smith", "Taylor", "House", "Herrema", "Bisbee", "Moore", "Garcia", "Huber", "Ungrey", "Geurink", "Lancto", "Cook", "Wayne"];

function getCustomerId(id){
    var custId = -1;
    for(let i = 0; i < allCustomers.length; i++){
        if(allCustomers[i].id == id){
            custId = i;
            break;
        }
    }
    return custId;
}

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
    let firstName = firstNames[generateRandom(0, firstNames.length-1)];
    let lastName = lastNames[generateRandom(0, lastNames.length-1)];
    let fullName = firstName + " " + lastName;
    //0 - poor, 1 - middle income, 2 - rich
    let financialStatus = generateRandom(0,2);
    let loanRequestAmt = generateLoanRequestAmt(financialStatus);
    let requestedInterest = defaultInterest;
    let trustworthyness = generateRandom(1,100);
    const customer = {
        Name: fullName,
        requestedAmount: loanRequestAmt,
        trustworthyPercent: trustworthyness,
        interestPercent: 0,
        id: 0
    };
    customer.id = generateRandom(1000,9999);
    allCustomers.push(customer);
    unservedCustomers.push(customer.id);
}