//graph type handler
var selectedGraphType = document.getElementById("graphType");
selectedGraphType.onchange = (event) =>{
    var inputText = event.target.value;
    document.getElementById("verificationText").innerText = inputText;
    if(inputText == "scatter"){
        newScatterplot();
    }
}

//X and Y axis handler
function addRow(){
    let container = document.getElementById("inputContainer");
    let div = document.createElement("div");
    div.classList.add("inputRow");
    div.innerHTML = 
        <input type="number" placeholder="x-value" class="x-input">
        <input type="number" placeholder = "y-value" class="y-input">
        <button onclick="removeRow(this)">Remove</button>
    ;
    container.appendChild(div);
}

//graph generator
function newScatterplot(){
    
    const xyValues = [
        {x:1, y:5},
        {x:2, y:3},
        {x:3, y:5}
    ];
    
    const graphOptions = ["beans", "cheese", "orangutang"];
    const myChart = new Chart(document.getElementById("graphOutputCanvas"),{
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
