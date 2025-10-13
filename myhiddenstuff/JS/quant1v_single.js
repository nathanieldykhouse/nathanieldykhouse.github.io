var userSettings = {
    pointRad: 5
};

const appletSettings = {
    showBoxplotOverlay: false
};

/* ANALYSIS AND GRAPHING */

function updateMainGraph(){
    const graphZoneDiv = document.getElementById("graphZoneWrapper");
    
    //process data
    var processedData = [];
    processedData = STAPPLET.DATA.splitRawData(document.getElementById("userDataInputField").value);
    
    const graph = document.createElement("div");
    graph.classList.add('graph');
    graphZoneDiv.appendChild(graph);
    
    const graphTypeDropdown = document.getElementById("graphTypeDropdown");
    switch(graphTypeDropdown.value){
        case 'dotplot':
            //make new graph canvas
            STAPPLET.GRAPHS.makeDotplot(processedData, graph, document.getElementById("quantVarNameInput").value);
            break;
        case 'histogram':
            STAPPLET.GRAPHS.makeHistogram(processedData, graph, document.getElementById("quantVarNameInput").value);
            break;
    }
}

function analyzeRaw(){
    //div that holds the graph results and options
    const graphZoneDiv = document.getElementById("graphZoneWrapper");
    
    //if the page has just started and the graph block is hidden, show graph block
    if(graphZoneDiv.style.display === "none"){
        graphZoneDiv.style.display = "block";
    }
    
    STAPPLET.UI.clearDiv(graphZoneDiv);
    
    //create new dropdown for graph type as well as its label
    const newDropDiv = document.createElement("div");
    newDropDiv.classList.add('dataEntryWrapper');
    
    const newDropdownLabel = document.createElement("label");
    newDropdownLabel.htmlFor = "graphTypeDropdown";
    newDropdownLabel.innerText = "Graph Type: ";
    
    newDropDiv.appendChild(newDropdownLabel);
    
    let dropdownOptions = ["Dotplot", "Histogram", "Boxplot", "Stemplot", "Normal Probability plot"];
    let dropdownValues = ["dotplot", "histogram", "box", "stem", "normalprob"];
    var newDropdown = STAPPLET.UI.makeDropdown('graphTypeDropdown', dropdownOptions, dropdownValues);
    newDropdown.addEventListener('change', function(){
        updateMainGraph();
    });
    
    newDropDiv.appendChild(newDropdown);
    graphZoneDiv.appendChild(newDropDiv);
    
    //create new checkbox for showing a boxplot over top
    
    const newCheckDiv = document.createElement("div");
    newCheckDiv.classList.add("dataEntryWrapper");
    
    const boxPlotToggle = document.createElement("input");
    boxPlotToggle.type = "checkbox";
    boxPlotToggle.id = "boxplotToggle";
    boxPlotToggle.addEventListener("change", function(){
        appletSettings.showBoxplotOverlay = boxPlotToggle.checked;
    });
    
    const newCheckLabel = document.createElement("label");
    newCheckLabel.innerText = "Show Boxplot";
    newCheckLabel.htmlFor = "boxplotToggle";
    
    newCheckDiv.appendChild(boxPlotToggle);
    newCheckDiv.appendChild(newCheckLabel);
        
    graphZoneDiv.appendChild(newCheckDiv);
    
    updateMainGraph();
}

/* takes the data type and constructs graph/information based on the value*/
function analyzeInputs(){
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    
    const graphZoneDiv = document.getElementById("graphZoneWrapper");
    
    const dataType = dataTypeDropdown.value;
    
    var processedData = [];
    
    if(dataType === "raw"){
        analyzeRaw();
    }
}

function changeInputDivType(){
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    
    const dynamicDataEntryDiv = document.getElementById("modularDataEntryDiv");
    
    STAPPLET.UI.clearDiv(dynamicDataEntryDiv);
    
    const newTypeValue = dataTypeDropdown.value;
    
    //div to add to the input zone
    let newSubDiv = document.createElement("div");
    newSubDiv.classList.add('standardEntryWrapper');
    

    //create wrapper for actual data entry label and input for correct formatting
    const newWrapper = document.createElement("div");
    newWrapper.classList.add('dataEntryWrapper');
    
    
    if(newTypeValue === "raw"){
        
        //new content to add to div
        let newInstructionText = document.createElement("p");
        newInstructionText.innerText = "Input data separated by commas or spaces.";
        newSubDiv.appendChild(newInstructionText);
        
        
        //operations performed in newWrapper
        
        let newLabel = document.createElement("label");
        newLabel.innerText = "Data: ";
        newLabel.htmlFor = "userDataInputField";
        newWrapper.appendChild(newLabel);
        
        let newUserInput = document.createElement("input");
        newUserInput.id = "userDataInputField";
        newUserInput.type = "text";
        newUserInput.placeholder = "enter data here";
        newWrapper.appendChild(newUserInput);

        //end of newWrapper operations
    } else if(newTypeValue === "meanAndSD"){
        
        //mean input
        let newMeanLabel = document.createElement("label");
        newMeanLabel.htmlFor = "meanUserInputField";
        newMeanLabel.innerText = "Mean: ";
        newWrapper.appendChild(newMeanLabel);
        
        let newMeanInput = document.createElement("input");
        newMeanInput.type = "text";
        newMeanInput.id = "meanUserInputField";
        newMeanInput.placeholder = "mean data";
        newWrapper.appendChild(newMeanInput);
        
        
        //standard deviation input
        let newSDLabel = document.createElement("label");
        newSDLabel.htmlFor = "sdUserInputField";
        newSDLabel.innerText = "SD: ";
        newWrapper.appendChild(newSDLabel);
        
        let newSDInput = document.createElement("input");
        newSDInput.type = "text";
        newSDInput.id = "sdUserInputField";
        newSDInput.placeholder = "SD Data";
        newWrapper.appendChild(newSDInput);
        
        //n input (number of data values)
        let newNLabel = document.createElement("label");
        newNLabel.innerText = "n: ";
        newNLabel.htmlFor = "nValueInput";
        newWrapper.appendChild(newNLabel);
        
        let newNInput = document.createElement("input");
        newNInput.type = "text";
        newNInput.id = "nValueInput";
        newNInput.placeholder = "# data points";
        newWrapper.appendChild(newNInput);
        
        //end of operations performed in newWrapper
    } else if(newTypeValue === "fiveNumSummary"){
        
        //min
        let newMinLabel = document.createElement("label");
        newMinLabel.htmlFor = "minValueInput";
        newMinLabel.innerText = "Min: ";
        newWrapper.appendChild(newMinLabel);
        
        let newMinInput = document.createElement("input");
        newMinInput.type = "text";
        newMinInput.id = "minValueInput";
        newMinInput.placeholder = "Min value";
        newWrapper.appendChild(newMinInput);
        
        //Q1
        let newQ1Label = document.createElement("label");
        newQ1Label.htmlFor = "q1ValueInput";
        newQ1Label.innerText = "Q1: ";
        newWrapper.appendChild(newQ1Label);
        
        let newQ1Input = document.createElement("input");
        newQ1Input.type = "text";
        newQ1Input.id = "q1ValueInput";
        newQ1Input.placeholder = "Q1 value";
        newWrapper.appendChild(newQ1Input);
        
        //median
        let newMedianLabel = document.createElement("label");
        newMedianLabel.htmlFor = "medianValueInput";
        newMedianLabel.innerText = "Median: ";
        newWrapper.appendChild(newMedianLabel);
        
        let newMedianInput = document.createElement("input");
        newMedianInput.type = "text";
        newMedianInput.id = "medianValueInput";
        newMedianInput.placeholder = "median value";
        newWrapper.appendChild(newMedianInput);
        
        //Q3
        let newQ3Label = document.createElement("label");
        newQ3Label.htmlFor = "Q3ValueInput";
        newQ3Label.innerText = "Q3: ";
        newWrapper.appendChild(newQ3Label);
        
        let newQ3Input = document.createElement("input");
        newQ3Input.type = "text";
        newQ3Input.id = "Q3ValueInput";
        newQ3Input.placeholder = "Q3 Value";
        newWrapper.appendChild(newQ3Input);
        
        //max
        let newMaxLabel = document.createElement("label");
        newMaxLabel.htmlFor = "maxValueInput";
        newMaxLabel.innerText = "Max: ";
        newWrapper.appendChild(newMaxLabel);
        
        let newMaxInput = document.createElement("input");
        newMaxInput.type = "text";
        newMaxInput.id = "maxValueInput";
        newMaxInput.placeholder = "max value";
        newWrapper.appendChild(newMaxInput);
    }
    newSubDiv.appendChild(newWrapper);
    dynamicDataEntryDiv.appendChild(newSubDiv);
}

/* Event Listeners */

function applyInitialEventListeners(){
    /* detect data type input change */
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    dataTypeDropdown.addEventListener('change', function(){
        changeInputDivType();
    });
    
    const beginAnalysisButton = document.getElementById("beginAnalysisButton")
    beginAnalysisButton.addEventListener('click', function(){
        if(dataTypeDropdown.value === "raw"){
            const userRawInput = document.getElementById("userDataInputField");
            if(userRawInput){
                analyzeInputs();
            }
        }
    })
    
    document.addEventListener('keydown', function(event){
        if(event.key === 'r'){
            let userIn = prompt("Enter new point radius: ");
            if(STAPPLET.UTILITY.isValidInteger(userIn)){
                let intNum = parseInt(userIn);
                STAPPLET.SETTINGS.updateSetting("pointRadius", intNum);
                const userRawInput = document.getElementById("userDataInputField");
                if(userRawInput){
                    analyzeInputs();
                }
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', function(){
    applyInitialEventListeners();
    changeInputDivType();
})
