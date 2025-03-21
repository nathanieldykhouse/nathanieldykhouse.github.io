//current Chart
var currentChart = null;
//graph type handler
var selectedGraphType = document.getElementById("graphType");
var xAxis = [];
var yAxis = [];
var xyAxis = [];

selectedGraphType.onchange = (event) =>{
    var inputText = event.target.value;
    resetInputs();
    generateGraph();
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

//analysis table


function getPercentages(rawValues){
    let percentageList = [];
    var sumAllNums = 0;
    for(var curIndex = 0; curIndex < rawValues.length; curIndex++){
        sumAllNums += rawValues[i];
    }
    for(var i = 0; i < rawValues.length; i++){
        let percentage = rawValues[i]/sumAllNums;
        
    }
}

function buildTable(){
    let rawValuesQuery = document.querySelectorAll(".y-input");
    let rawValues = [];
    for(var i = 0; i < rawValuesQuery.length; i++){
        let y = parseFloat(rawValuesQuery[i].value);
        rawValues.push(y);
    }
    getPercentages(rawValues);
}

resetInputs();
