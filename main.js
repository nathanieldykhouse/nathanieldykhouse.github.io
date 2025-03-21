//current Chart
var currentChart = null;
//graph type handler
var selectedGraphType = document.getElementById("graphType");
selectedGraphType.onchange = (event) =>{
    var inputText = event.target.value;
    resetInputs();
    if(inputText == "scatter"){
        newScatterplot();
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
    inputX.addEventListener("input", generateGraph);
    inputY.addEventListener("input", generateGraph);
    div.appendChild(inputX);
    div.appendChild(inputY);
    div.appendChild(removeButton);
    container.appendChild(div);
}

function getAllColors(){
    return ["red","green","blue","purple","cyan","brown","orange","light-blue", "yellow","magenta","goldenrod"];
}

//graph generator
function newBarGraph(){
    let xValuesQuery = document.querySelectorAll(".x-input");
    let yValuesQuery = document.querySelectorAll(".y-input");
    let xValues = [];
    let yValues = [];
    for(var i = 0; i < xValuesQuery.length; i++){
        let x = xValuesQuery[i].value;
        let y = parseFloat(yValuesQuery[i].value);
        
        xValues.push(x);
        yValues.push(y);
    }
    let colors = getAllColors();
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "bar",
        data: {
            datasets: [{
                backgroundColor: colors,
                data: yValues
            }],
            labels: xValues
        },
        options: {}
    });
}


function newScatterplot(){
    let xyValues=[];
    let xValues = document.querySelectorAll(".x-input");
    let yValues = document.querySelectorAll(".y-input");
    for(let i = 0; i < xValues.length; i++){
        let x = parseFloat(xValues[i].value);
        let y = parseFloat(yValues[i].value);
        if(!isNaN(x) && !isNaN(y)){
            xyValues.push({x: x, y: y});
        }
    }
    
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "scatter",
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgba(0,0,255,1)",
                data: xyValues
            }]
        },
        options: {}
    });
}

function newLineGraph(){
    let xValuesQuery = document.querySelectorAll(".x-input");
    let yValuesQuery = document.querySelectorAll(".y-input");
    let xValues = [];
    let yValues = [];
    for(let i = 0; i < xValuesQuery.length; i++){
        let x = parseFloat(xValuesQuery[i].value);
        let y = parseFloat(yValuesQuery[i].value);
        xValues.push(x);
        yValues.push(y);
    }
    
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "line",
        label: xValues,
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgba(0,0,255,1)",
                backgroundColor: "rgba(0,0,0,0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: yValues
            }]
        },
        options: {}
    });
}

function newPieChart(){
    let xValuesQuery = document.querySelectorAll(".x-input");
    let yValuesQuery = document.querySelectorAll(".y-input");
    let xValues = [];
    let yValues = [];
    for(let i = 0; i < xValuesQuery.length; i++){
        let x = xValuesQuery[i].value;
        let y = parseFloat(yValuesQuery[i].value);
        xValues.push(x);
        yValues.push(y);
    }
    
    let colors = getAllColors();
    
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: colors,
                data: yValues
            }]
        },
        options: {}
    });
}

function newDonutChart(){
    let xValuesQuery = document.querySelectorAll(".x-input");
    let yValuesQuery = document.querySelectorAll(".y-input");
    let xValues = [];
    let yValues = [];
    for(let i = 0; i < xValuesQuery.length; i++){
        let x = xValuesQuery[i].value;
        let y = parseFloat(yValuesQuery[i].value);
        xValues.push(x);
        yValues.push(y);
    }
    
    let colors = getAllColors();
    
    currentChart = new Chart(document.getElementById("graphOutputCanvas"),{
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: colors,
                data: yValues
            }]
        },
        options: {}
    });
}

resetInputs();
