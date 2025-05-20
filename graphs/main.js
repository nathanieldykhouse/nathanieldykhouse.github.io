//current Chart
var currentChart = null;
//graph type handler
var selectedGraphType = document.getElementById("graphType");
var xAxis = [];
var yAxis = [];
var xyAxis = [];
//analysis handler
var selectedTableType = document.getElementById("tableType");

selectedGraphType.onchange = (event) =>{
    var inputText = event.target.value;
    resetInputs();
    generateGraph();
}

selectedTableType.onchange = (event) =>{
    generateTable();
}

function checkGraphInfoChange(){
    let previousXAxis = xAxis;
    let previousYAxis = yAxis;
    buildAxes();
    var xAxisIdentical = true;
    var yAxisIdentical = true;
    for(let i = 0; i < xAxis.length; i++){
        let prevXVal = previousXAxis[i];
        let curXVal = xAxis[i];
        if(prevXVal != curXVal){
            xAxisIdentical = false;
        }
    }
    for(let i = 0; i < yAxis.length; i++){
        let prevYVal = previousYAxis[i];
        let curYVal = yAxis[i];
        if(prevYVal != curYVal){
            yAxisIdentical = false;
        }
    }
    if(!xAxisIdentical || !yAxisIdentical){
        generateGraph();
    } else{
        xAxis = null;
        xAxis = previousXAxis;
        yAxis = null;
        yAxis = previousYAxis;
    }
}

function destroyChart(){
    if(currentChart){
        currentChart.destroy();
        currentChart = null;
    }
}

function generateGraph(){
    var newGraphType = document.getElementById("graphType").value;
    destroyChart();
    buildAxes();
    switch(newGraphType){
        case "bar":
            newBarGraph();
            break;
        case "scatter":
            newScatterplot();
            break;
        case "line":
            newLineGraph();
            break;
        case "pie":
            newPieChart();
            break;
        case "donut": newDonutChart();
    }
    generateTable();
}

function resetInputs(){
    let container = document.getElementById("inputContainer");
    var childCount = container.children.length;
    for(var i = 0; i < childCount-2; i++){
        container.removeChild(container.lastChild);
    }
    for(var j = 0; j < 2; j++){
        addRow();
    }
}

//X and Y axis handler
function addRow(){
    let container = document.getElementById("inputContainer");
    var curGraphType = document.getElementById("graphType").value;
    let div = document.createElement("div");
    let inputX = document.createElement("input");
    let inputY = document.createElement("input");
    let removeButton = document.createElement("button");
    switch(curGraphType){
        case "bar":
            inputX.type = "text";
            inputX.placeholder = "Label";
            inputY.type = "number";
            inputY.placeholder = "value";
            break;
        case "scatter":
            inputX.type = "number";
            inputX.placeholder = "x-value";
            inputY.type = "number";
            inputY.placeholder = "y-value";
            break;
        case "line":
            inputX.type = "number";
            inputX.placeholder = "x-value";
            inputY.type = "number";
            inputY.placeholder = "y-value";
            break;
        case "pie":
            inputX.type = "text";
            inputX.placeholder = "label";
            inputY.type = "number";
            inputY.placeholder = "value";
            break;
        case "donut":
            inputX.type = "text";
            inputX.placeholder = "label";
            inputY.type = "number";
            inputY.placeholder = "value";
            break;
    }
    inputX.classList.add("x-input");
    inputY.classList.add("y-input");
    removeButton.textContent = "Remove";
    removeButton.onclick = function(){
        div.remove();
        generateGraph();
    }
    inputX.addEventListener("input", checkGraphInfoChange);
    inputY.addEventListener("input", checkGraphInfoChange);
    div.appendChild(inputX);
    div.appendChild(inputY);
    div.appendChild(removeButton);
    container.appendChild(div);
}

function getAllColors(){
    return ["red","green","blue","purple","cyan","brown","orange","light-blue", "yellow","magenta","goldenrod"];
}

function buildAxes(){
    var currentGraphType = document.getElementById("graphType").value;
    var xIsString = false;
    switch(currentGraphType){
        case "bar":
            xIsString = true;
            break;
        case "scatter":
            xIsString = false;
            break;
        case "line":
            xIsString = false;
            break;
        case "pie":
            xIsString = true;
            break;
        case "donut":
            xIsString = true;
            break;
    }
    var xValuesQuery = document.querySelectorAll(".x-input");
    var yValuesQuery = document.querySelectorAll(".y-input");
    var xValues = [];
    var yValues = [];
    var xyValues = [];
    if(xIsString){
        for(var i = 0; i < xValuesQuery.length; i++){
            var x = xValuesQuery[i].value;
            var y = parseFloat(yValuesQuery[i].value);
            if(!isNaN(y)){
                xValues.push(x);
                yValues.push(y);
            }
        }
        xAxis = [];
        xAxis = xValues;
        yAxis = [];
        yAxis = yValues;
    } else{
        for(let i = 0; i < xValuesQuery.length; i++){
            let x = parseFloat(xValuesQuery[i].value);
            let y = parseFloat(yValuesQuery[i].value);
            if(!isNaN(x) && !isNaN(y)){
                xyValues.push({x: x, y: y});
                xValues.push(x);
                yValues.push(y);
            }
        }
        xAxis = null;
        xAxis = xValues;
        yAxis = null;
        yAxis = yValues;
        xyAxis = null;
        xyAxis = xyValues;
    }
}

//graph generator
function newBarGraph(){
    let colors = getAllColors();
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "bar",
        data: {
            datasets: [{
                backgroundColor: colors,
                data: yAxis
            }],
            labels: xAxis
        },
        options: {}
    });
}


function newScatterplot(){
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "scatter",
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgba(0,0,255,1)",
                data: xyAxis
            }]
        },
        options: {}
    });
}

function newLineGraph(){
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "line",
        label: xAxis,
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgba(0,0,255,1)",
                backgroundColor: "rgba(0,0,0,0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yAxis
            }]
        },
        options: {}
    });
}

function newPieChart(){
    let colors = getAllColors();
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "pie",
        data: {
            labels: xAxis,
            datasets: [{
                backgroundColor: colors,
                data: yAxis
            }]
        },
        options: {}
    });
}

function newDonutChart(){
    let colors = getAllColors();
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "doughnut",
        data: {
            labels: xAxis,
            datasets: [{
                backgroundColor: colors,
                data: yAxis
            }]
        },
        options: {}
    });
}

//helpful stuff

function checkSort(input){
    var prevValue = -999999999999999;
    var isSorted = true;
    for(let i = 0; i < input.length; i++){
        if(input[i] < prevValue){
            isSorted = false;
        } else{
            prevValue = input[i];
        }
    }
    return isSorted;
}

function sortList(rawInput){
    var sortedList = rawInput;
    var isSorted = checkSort(sortedList);
    while(!isSorted){
        for(let i = 0; i < sortedList.length; i++){
            let nextValue = sortedList[i+1];
            let curValue = sortedList[i];
            if(curValue > nextValue){
                sortedList[i] = nextValue;
                sortedList[i+1] = curValue;
            }
        }
        let sorted = checkSort(sortedList);
        if(sorted == true){
            isSorted = true;
        } else{
            continue;
        }
    }
    return sortedList;
}

//analysis table

function deletePreviousTable(){
    let container = document.getElementById("analysisTable");
    let tableType = document.getElementById("tableTypeDropdown");
    let containerHead = document.getElementById("analysisTableHead");
    let containerBody = document.getElementById("analysisTableBody");
    var childCountHead = containerHead.children.length;
    var childCountBody = containerBody.children.length;
    for(let i = 0; i < childCountHead; i++){
        containerHead.removeChild(containerHead.lastChild);
    }
    for(let i = 0; i < childCountBody; i++){
        containerBody.removeChild(containerBody.lastChild);
    }
}

function displayTable(rawValues, percentageList){
    let container = document.getElementById("analysisTableBody");
    for(let i = 0; i < xAxis.length; i++){
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");
        let cell3 = document.createElement("td");
        cell1.textContent = xAxis[i];
        cell2.textContent = rawValues[i];
        cell3.textContent = (percentageList[i]*100).toFixed(2) + "%";
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        container.appendChild(row);
    }
}

function getPercentages(rawValues){
    let percentageList = [];
    var sumAllNums = 0;
    for(let i = 0; i < rawValues.length; i++){
        sumAllNums += rawValues[i];
    }
    for(let i = 0; i < rawValues.length; i++){
        let percentage = rawValues[i]/sumAllNums;
        percentageList.push(percentage);
    }
    return percentageList;
}

function getMean(rawVals){
    let totalRaw = 0;
    for(let i = 0; i < rawVals.length; i++){
        totalRaw += rawVals[i];
    }
    return totalRaw/(rawVals.length-1);
}

function getMedian(rawVals){
    let sortedVals = sortList(rawVals);
}

function buildFrequencyTable(){
    let rawValues = yAxis;
    var percentageList = getPercentages(rawValues);
    displayTable(rawValues, percentageList)
}

function buildMMMSDTable(){
    let rawValues = yAxis;
    let mean = getMean(rawValues);
    let median = getMedian(rawValues);
    let mode = 0;
}

function generateTable(){
    deletePreviousTable();
    let tableType = document.getElementById("tableType").value;
    let thead = document.getElementById("analysisTableHead");
    if(tableType == "frequency"){
        let hc1 = document.createElement("th");
        let hc2 = document.createElement("th");
        let hc3 = document.createElement("th");
        hc1.textContent = "Value";
        hc2.textContent = "Frequency";
        hc3.textContent = "Relative Frequency";
        thead.appendChild(hc1);
        thead.appendChild(hc2);
        thead.appendChild(hc3);
        buildFrequencyTable();
    } else if(tableType == "mmmsd"){
        let hc1 = document.createElement("th");
        let hc2 = document.createElement("th");
        let hc3 = document.createElement("th");
        let hc4 = document.createElement("th");
        hc1.textContent = "Mean";
        hc2.textContent = "Median";
        hc3.textContent = "Mode";
        hc4.textContent = "Standard Deviation";
        thead.appendChild(hc1);
        thead.appendChild(hc2);
        thead.appendChild(hc3);
        thead.appendChild(hc4);
        buildMMMSDTable();
    }
    
}

resetInputs();
