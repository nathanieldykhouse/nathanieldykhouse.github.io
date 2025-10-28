var userSettings = {
    pointRad: 5
};

const appletSettings = {
    showBoxplotOverlay: false
};

/* ANALYSIS AND GRAPHING */

function updateMainGraph(){
    //get graph zone and data type dropdown
    const graphZoneDiv = document.getElementById("mainGraphZoneWrapper");
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    
    const newGraphTypeSel = document.getElementById("graphTypeDropdown").value;

    //decide which data input type is correct
    const dataType = dataTypeDropdown.value;
    
    if(dataType === "raw"){
        analyzeRaw();
    } else if(dataType === "fiveNumSummary"){
        alert("analyzeFNS");
        analyzeFNS();
    }
}

function makeMainAnalysisTable(wrapperElem){
    if(document.getElementById("inputTypeSelector").value === "raw"){
        const data = STAPPLET.UTILITY.splitRawData(document.getElementById("userDataInputField").value);
        
        const amtSigFigs = 5;
        
        const n = data.length;
        const mean = STAPPLET.DATA.roundToPrecision(STAPPLET.DATA.calculateMean(data), amtSigFigs);
        const standardDev = STAPPLET.DATA.roundToPrecision(STAPPLET.DATA.calculateStandardDeviation(data), amtSigFigs);
        let [min, max] = STAPPLET.DATA.findMinAndMaxVals(data);
        const q1 = STAPPLET.DATA.roundToPrecision(STAPPLET.DATA.findQ1(data), amtSigFigs);
        const median = STAPPLET.DATA.roundToPrecision(STAPPLET.DATA.findMedian(data), amtSigFigs);
        const q3 = STAPPLET.DATA.roundToPrecision(STAPPLET.DATA.findQ3(data), amtSigFigs);
        
        min = STAPPLET.DATA.roundToPrecision(min, amtSigFigs);
        max = STAPPLET.DATA.roundToPrecision(max, amtSigFigs);
        
        STAPPLET.UI.makeNewTable(
            wrapperElem, 
            ["n", "mean", "SD", "min", "Q1", "med", "Q3", "max"], 
            [[n, mean, standardDev, min, q1, median, q3, max]],
            "mainAnalysisTable",
            true
        );
    }
}

function createMainGraph(processedData){
    const graphZoneDiv = document.getElementById("mainGraphZoneWrapper");
    
    //clear previous graph
    const oldGraphs = graphZoneDiv.querySelectorAll(".graph");
    if(oldGraphs.length > 0){
        oldGraphs.forEach(graph => graph.remove());
    }
    
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    
    //make new graph
    const graph = document.createElement("div");
    
    if(dataTypeDropdown.value === "raw"){
        graph.classList.add('graph');
        graphZoneDiv.appendChild(graph);
        
        
        const graphTypeDropdown = document.getElementById("graphTypeDropdown");
        
        if(appletSettings.showBoxplotOverlay === true){
            STAPPLET.GRAPHS.makeBoxplotOverlay(processedData, graph);
        }
        switch(graphTypeDropdown.value){
            case 'dotplot':
                //make new graph canvas
                STAPPLET.GRAPHS.makeDotplot(processedData, graph, document.getElementById("quantVarNameInput").value);
                break;
            case 'histogram':
                STAPPLET.GRAPHS.makeHistogram(processedData, graph, document.getElementById("quantVarNameInput").value);
                break;
            case 'box':
                STAPPLET.GRAPHS.makeBoxplot(processedData, graph, document.getElementById("quantVarNameInput").value);
                break;
            case 'normalprob':
                STAPPLET.GRAPHS.makeNormalProbabilityPlot(processedData, graph, document.getElementById("quantVarNameInput").value);
                break;
        }
    } else if(dataTypeDropdown.value == "fiveNumSummary"){
        graphZoneDiv.appendChild(graph);
        
        const graphName = document.getElementById("quantVarNameInput").value;
        const min = document.getElementById("minValueInput").value;
        const q1 = document.getElementById("q1ValueInput").value;
        const median = document.getElementById("medianValueInput").value;
        const q3 = document.getElementById("q3ValueInput").value;
        const max = document.getElementById("maxValueInput").value;
        
        const graphInfo = {
            group: graphName,
            q1: STAPPLET.UTILITY.toNumber(q1),
            median: STAPPLET.UTILITY.toNumber(median),
            q3: STAPPLET.UTILITY.toNumber(q3),
            min: STAPPLET.UTILITY.toNumber(min),
            max: STAPPLET.UTILITY.toNumber(max)
        };
        
        STAPPLET.GRAPHS.makeBoxplot([/*nothing here, just need to pass it*/], graph, graphName, graphInfo);
    }
    
    const svg = d3.select("#mainGraphZoneWrapper").select("svg");
    svg.classed("graph", true);
}

function analyzeFNS(){
    createMainGraph([/*just have to pass this*/]);
}

function analyzeRaw(){
    //div that holds the graph results and options
    const graphZoneDiv = document.getElementById("mainGraphZoneWrapper");
    
    //process data
    var processedData = [];
    processedData = STAPPLET.UTILITY.splitRawData(document.getElementById("userDataInputField").value);
    
    
    createMainGraph(processedData);
}

/* constructs the inputs */
function analyzeInputs(){
    const dataTypeDropdown = document.getElementById("inputTypeSelector");
    
    //div that holds the graph results and options
    const graphZoneDiv = document.getElementById("mainGraphZoneWrapper");
    
    //clear graph of old elements to ensure no remnants
    STAPPLET.UI.clearDiv(graphZoneDiv);
    
    //if the page has just started and the graph block is hidden, show graph block
    if(graphZoneDiv.style.display === "none"){
        graphZoneDiv.style.display = "flex";
    }
    
    if(dataTypeDropdown.value == "raw"){
        
        const newContainerDiv = document.createElement("div");
        newContainerDiv.classList.add('standardEntryWrapper');
        
        
        //create new dropdown for graph type as well as its label
        const newDropDiv = document.createElement("div");
        newDropDiv.classList.add('dataEntryWrapper');
        
        const dropdownOptions = ["Dotplot", "Histogram", "Boxplot", "Normal Probability plot"];
        const dropdownValues = ["dotplot", "histogram", "box", "normalprob"];
        STAPPLET.UI.makeNewLabeledDropdown(newDropDiv, "Graph Type: ", "graphTypeDropdown", dropdownValues, dropdownOptions, updateMainGraph);
        
        newContainerDiv.appendChild(newDropDiv);
        
        //create new checkbox for showing a boxplot over top
        
        const newCheckDiv = document.createElement("div");
        newCheckDiv.classList.add("dataEntryWrapper");
        
        const eventListener = function(e){
            appletSettings.showBoxplotOverlay = e.target.checked;
            updateMainGraph();
        };
        
        STAPPLET.UI.makeNewLabeledCheckbox(newCheckDiv, "Show Boxplot: ", "boxplotToggle", false, eventListener);
        
        newContainerDiv.appendChild(newCheckDiv);
        
        makeMainAnalysisTable(newContainerDiv);
        
        graphZoneDiv.appendChild(newContainerDiv);
        
        updateMainGraph();
    } else if(dataTypeDropdown.value == "fiveNumSummary"){
        analyzeFNS();
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
        
        STAPPLET.UI.makeNewLabeledInput(newWrapper, "Data: ", "userDataInputField", "text", "enter data here: ");
        
        //end of newWrapper operations
    } else if(newTypeValue === "meanAndSD"){
        
        //mean, standard deviation, and number of elements input zone
        STAPPLET.UI.groupMakeNewLabeledInput(newWrapper, [
           ["Mean: ", "meanUserInputField", "text", "Mean Data"],
           ["SD: ", "sdUserInputField", "text", "SD Data"],
           ["N: ", "nValueInput", "text", "# of data points"]
        ]);
        
    } else if(newTypeValue === "fiveNumSummary"){
        STAPPLET.UI.groupMakeNewLabeledInput(newWrapper, [
            ["Min: ", "minValueInput", "text", "Min Value"],
            ["Q1: ", "q1ValueInput", "text", "Q1 Value"],
            ["Median: ", "medianValueInput", "text", "Median Value"],
            ["Q3: ", "q3ValueInput", "text", "Q3 Value"],
            ["Max: ", "maxValueInput", "text", "Max Value"]
        ]);
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
    
    const beginAnalysisButton = document.getElementById("beginAnalysisButton");
    beginAnalysisButton.addEventListener('click', function(){
        const preExistingInputField = document.getElementById("mainGraphZoneCard")
        if(!preExistingInputField){
            STAPPLET.UI.makeNewContentCard(
                {
                    cardTitle: "Graphing",
                    cardId: "mainGraphZoneCard",
                    cardClass: "contentChunkWrapper",
                    cardContentId: "mainGraphZoneWrapper",
                    defaultVisibility: "visible"
                }, document.getElementById("mainPageContent"));
        }
        
        if(dataTypeDropdown.value === "raw"){
            const userRawInput = document.getElementById("userDataInputField");
            if(userRawInput){
                analyzeInputs();
            }
        } else if(dataTypeDropdown.value === "fiveNumSummary"){
            analyzeInputs();
        }
    });
}

document.addEventListener('DOMContentLoaded', function(){
    applyInitialEventListeners();
    changeInputDivType();
});

//toggleable debug stuffs
document.addEventListener('keydown', function(event){
    if(event.key === ']'){
        const graphZoneDiv = document.getElementById("mainGraphZoneWrapper");
        alert("Current display setting for mainGraphZoneWrapper is: " + graphZoneDiv.style.display);
        alert("The amount of child objects for mainGraphZoneWrapper is: " + graphZoneDiv.children.length);
    } else if(event.key === '`'){
        const dataTypeDropdown = document.getElementById("inputTypeSelector");
        if(dataTypeDropdown.value == "raw"){
            const dataInputField = document.getElementById("userDataInputField");
            dataInputField.value = "72 85 90 88 76 95 67 82 78 91 84 89 77";
        } else if(dataTypeDropdown.value == "fiveNumSummary"){
            const minInputField = document.getElementById("minValueInput");
            const q1ValueInput = document.getElementById("q1ValueInput");
            const medianValin = document.getElementById("medianValueInput");
            const q3ValueInput = document.getElementById("q3ValueInput");
            const maxvalin = document.getElementById("maxValueInput");
            minInputField.value = "67";
            q1ValueInput.value = "76.5";
            medianValin.value = "84";
            q3ValueInput.value = "89.5";
            maxvalin.value = "95";
        }
    }
});
