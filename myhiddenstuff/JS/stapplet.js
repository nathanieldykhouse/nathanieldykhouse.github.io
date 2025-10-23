/* global d3 */
/* 
    above message just stops the "too many errors" message on my IDE so that i can actually 
    tell where errors are
*/
var STAPPLET = STAPPLET || { };

//SETTINGS HANDLING
STAPPLET.SETTINGS = {
    userSettings: {
        pointRadius: 5,
        pointColor: 'rgb(255, 93, 125)'
    },
    
    graphSettings: {
        height: 400,
        width: 600,
        margins: {top: 40, right: 20, bottom: 40, left: 40}
        
    },
    
    updateSetting: function(setting, value){
        if(!STAPPLET.UTILITY.isValidInteger(value)){
            return;
        }
        switch(setting){
            case 'pointRadius':
                STAPPLET.SETTINGS.userSettings.pointRadius = parseInt(value);
        }
    }
};

//UI HANDLING
STAPPLET.UI = {
    /* erase a div */
    clearDiv: function(div){
        if(div.childElementCount > 0){
            //remove all of div's children to prepare it for next population
            div.replaceChildren();
        }
    },
    
    //ui control to make a new input with an attatched label
    makeNewLabeledInput: function(wrapperElem, labelText, inputObjId, inputType, placeholderText = ""){
        const newLabel = document.createElement("label");
        newLabel.htmlFor = inputObjId;
        newLabel.innerText = labelText;
        
        const newInputObj = document.createElement("input");
        newInputObj.id = inputObjId;
        newInputObj.type = inputType;
        newInputObj.placeholder = placeholderText;
        
        wrapperElem.appendChild(newLabel);
        wrapperElem.appendChild(newInputObj);
    },
    
    //make new labeled inputs in a chunk for easier creation of stuff like the five number summary input
    groupMakeNewLabeledInput: function(wrapperElem, args){
        args.forEach((labeledInputArgs, index) => {
            STAPPLET.UI.makeNewLabeledInput(wrapperElem, labeledInputArgs[0], labeledInputArgs[1], labeledInputArgs[2], labeledInputArgs[3]);
        });
    },
    
    //make new labeled dropdown
    makeNewLabeledDropdown: function(wrapperElem, labelText, dropdownId, dropdownOptions, dropdownOptionsText, onChange = "", defaultValue = null){
        const newLabel = document.createElement("label");
        newLabel.htmlFor = dropdownId;
        newLabel.innerText = labelText;
        
        const newDropdown = document.createElement("select");
        newDropdown.id = dropdownId;
        dropdownOptions.forEach((value, index) => {
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.textContent = dropdownOptionsText[index];
            newDropdown.appendChild(newOption);
        });
        
        if(typeof onChange === "function"){
            newDropdown.addEventListener('change', onChange);
        }
        
        if(defaultValue != undefined && defaultValue != null){
            const optionExists = Array.from(newDropdown.options).some(opt => opt.value === defaultValue);
            if (optionExists) {
                newDropdown.value = defaultValue;
            }
        }
        
        
        wrapperElem.appendChild(newLabel);
        wrapperElem.appendChild(newDropdown);
    },
    
    makeNewLabeledCheckbox: function(wrapperElem, labelText, checkBoxId, checkedByDefault, onChange){
        const newLabel = document.createElement("label");
        newLabel.htmlFor = checkBoxId;
        newLabel.innerText = labelText;
        
        const newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.checked = checkedByDefault;
        newCheckbox.id = checkBoxId;
        
        if(typeof onChange === "function"){
            newCheckbox.addEventListener('change', onChange);
        }
        
        wrapperElem.appendChild(newLabel);
        wrapperElem.appendChild(newCheckbox);
    },
    
    makeNewTable: function(wrapperElem, columnHeads, rowData, ID, simpleAppend = false){
        const newTable = document.createElement("table");
        newTable.id = ID;
        
        //thead
        const newTableHead = document.createElement("thead");
        const newTableHeaderRow = document.createElement("tr");
        columnHeads.forEach((headText, index) => {
            const newTh = document.createElement("th");
            newTh.innerText = headText;
            newTableHeaderRow.appendChild(newTh);
        });
        newTableHead.appendChild(newTableHeaderRow);
        newTable.appendChild(newTableHead);
        
        //tbody
        const newTableBody = document.createElement("tbody");
        
        rowData.forEach((row, index) => {
            const newTableRow = document.createElement("tr");
            row.forEach((val, index) => {
                const newTd = document.createElement("td");
                newTd.innerText = val;
                newTableRow.appendChild(newTd);
            });
            newTableBody.appendChild(newTableRow);
        });
        
        newTable.appendChild(newTableBody);
        
        //either just append object or return it based on what its use case is
        if(simpleAppend){
            wrapperElem.appendChild(newTable);
        } else{
            return newTable;
        }
    }
};

//UTILITY FUNCTIONS
STAPPLET.UTILITY = {
    /* turn raw data into a workable list by splitting at spaces and commas */
    splitRawData: function(dataInput){
        //splits the input data into a list at commas and spaces
        return dataInput
            .split(/[, ]+/)
            .map(x => x.trim())
            .filter(x => x !== "")
            .filter(x => !Number.isNaN(Number(x)))
            .map(Number);
    },
    //only checks for whole numbers --> without decimals
    isValidInteger: function(str){
        const num = parseInt(str, 10);
        return !isNaN(num) && num.toString() === String(str); 
    },
    
    //checks for numbers that both do or do not have decimals
    isValidNumber: function(str){
        const num = parseFloat(str);
        return !isNaN(num) && num.toString() === str.trim();
    },
    
    sortAscending: function(dataList){
        return [...dataList].sort(d3.ascending);
    },

    pairData: function(xList, yList){
        const pairList = [];
        xList.forEach((val, index) => {
            pairList.push({x: val, y: yList[index]});
        });
        return pairList;
    },
    
    toNumber: function(strIn){
        return Number(strIn);
    }
};

//DATA PROCESSING
STAPPLET.DATA = {
    
    //**GENERAL DATA MANIPULATION
    
    //find bin sizes using the data, max and min, and plugging those into the sturges rule
    findBinSize: function(dataList){
        //sturges rule
        const n = dataList.length;
        const k = Math.ceil(Math.log2(n) + 1);
        
        //find bin sizes from max-min and sturges rule
        const minVal = Math.min(...dataList);
        const maxVal = Math.max(...dataList);
        const binSize = (maxVal - minVal) / k;
        return binSize;
    },
    
    //finds the minimum and maximum values in a list of data, has some safeties in case the data is passed
    //as a list of strings by accident somehow, but if the data isn't formatted at all it will throw an error
    findMinAndMaxVals: function(dataList){
        //garuntee that the data is a numeric list in case it hasn't been converted yet for whatever reason
        const numericList = dataList
            .map(Number)
            .filter(x => !Number.isNaN(x) && Number.isFinite(x));
            
        if(numericList.length === 0){
            throw new Error("No valid numeric data found, perhaps it was never filtered?");
        }
        
        const min = Math.min(...numericList);
        const max = Math.max(...numericList);
        
        return [min,max];
    },
    
    findInterquartileRange: function(dataList){
        const quartile1 = STAPPLET.DATA.findQ1(dataList);
        const quartile3 = STAPPLET.DATA.findQ3(dataList);
        return quartile3 - quartile1;
    },
    
    //uses reduce() to find the mean of a data list
    calculateMean: function(dataList){
        //make sure there is actually data passed
        if(dataList.length === 0){
            return 0;
        }
        const sum = dataList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return sum / dataList.length;
    },
    
    calculateStandardDeviation: function(dataList, isPopulation = false){
        //calculate the mean
        const mean = STAPPLET.DATA.calculateMean(dataList);
        
        //calculate the variance
        const squaredDifferencesSum = dataList.reduce((acc, val) => {
            const diff = val - mean;
            return acc + (diff * diff);
        }, 0);
        
        const divisor = isPopulation ? dataList.length : (dataList.length - 1);
        const variance = squaredDifferencesSum / divisor;
        
        //calculate standard deviation
        const standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    },
    
    findQ1: function(dataList){
        const sortedList = STAPPLET.UTILITY.sortAscending(dataList);
        const n = sortedList.length;
        const medianIndex = Math.floor(n / 2);
        
        const lowerHalf = sortedList.slice(0, medianIndex);
        
        const nLower = lowerHalf.length;
        const q1Index = Math.floor(nLower / 2);
        
        if(nLower % 2 === 0){
            return (lowerHalf[q1Index - 1] + lowerHalf[q1Index]) / 2;
        } else{
            return lowerHalf[q1Index];
        }
    },
    
    findQ3: function(dataList){
        const sortedList = STAPPLET.UTILITY.sortAscending(dataList);
        const n = sortedList.length;
        
        // Start upper half after median
        const startIndex = Math.ceil(n / 2);
        const upperHalf = sortedList.slice(startIndex);
        
        const nUpper = upperHalf.length;
        const mid = Math.floor(nUpper / 2);
        
        return nUpper % 2 === 0 
            ? (upperHalf[mid - 1] + upperHalf[mid]) / 2
            : upperHalf[mid];
    },
    
    findMedian: function(dataList) {
        const sortedList = STAPPLET.UTILITY.sortAscending(dataList);
        const n = sortedList.length;
        if (n % 2 === 0) {
            return (sortedList[n / 2 - 1] + sortedList[n / 2]) / 2;
        }
        return sortedList[Math.floor(n / 2)];
    },
    
    roundToPrecision: function(inputNum, amtSigFigs){
        // toPrecision() returns a string, so convert it back to a number
        return Number(inputNum.toPrecision(amtSigFigs)); 
    },
    
    findPercentile: function(rank, n){
        return (rank - 0.5) / n; 
    },
    
    inverseCDF: function(value){
        return jStat.normal.inv(value, 0, 1);
    },
    
    computeLSRLInfo: function(dataPairs){
        const meanX = d3.mean(dataPairs, d => d.x);
        const meanY = d3.mean(dataPairs, d => d.y);

        const numerator = d3.sum(dataPairs, d => (d.x - meanX) * (d.y - meanY));
        const denominator = d3.sum(dataPairs, d => Math.pow(d.x - meanX, 2));

        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;

        return {slope, intercept};
    },
    //** FUNCTIONS FOR MANIPULATING AND RETURNING LISTS OF DATA
    
    //find the bin frequencies based on the data, bin sizes, and amount of bins
    binFrequencyFromData: function(dataList, binSize, amtBins){
        //math.ceil and math.floor used to make values nicer, most likely going to
        //add the option to use x amt of significant figures later when refining
        const minVal = Math.floor(Math.min(...dataList));
        const maxVal = Math.ceil(Math.max(...dataList));
        
        const frequencies = new Array(amtBins).fill(0);
        
        for(let i = 0; i < dataList.length; i++){
            const value = dataList[i];
            const binIndex = Math.floor((value - minVal) / binSize);
            
            const index = (binIndex === amtBins) ? amtBins - 1 : binIndex;
            
            frequencies[index]++;
        }
        
        return frequencies;
    },
    
    //create the ranges for bins based upon the bin sizes
    makeBinRanges: function(dataList, binSize, amtBins, minVal){
        
        //create bin edges
        const binRanges = [];
        for(let i = 0; i <= amtBins; i++){
            binRanges.push(minVal + i * binSize);
        }
        
        return binRanges;
    },
    
    makePercentiledList: function(dataList){
        const sortedList = STAPPLET.UTILITY.sortAscending(dataList); //ensure the list is sorted
        const n = dataList.length;
        return sortedList.map((_, i) => STAPPLET.DATA.findPercentile(i+1, n));
    },
    
    makeInverseCDFList: function(dataList){
        return dataList.map(val => STAPPLET.DATA.inverseCDF(val));
    },
    
    //** FUNCTIONS SPECIFIC TO GROUPS OF DATA FOR A GRAPH
    createDotplotData: function(dataList){
        
        dataList = dataList.map(x => Number(x)).filter(x => !isNaN(x));
        
        var dataValues = [];
        var dataValFrequencies = [];
        for(let index = 0; index < dataList.length; index++){
            if(dataValues.indexOf(dataList[index]) == -1){
                dataValues.push(dataList[index]);
                dataValFrequencies.push(1);
            } else{
                const valIndex = dataValues.indexOf(dataList[index]);
                dataValFrequencies[valIndex]++;
            }
        }
        var pairsArray = [];
        dataValues.forEach((value, index) => {
            const xVal = value;
            const amtDataPoints = dataValFrequencies[index];
            for(let i = 0; i < amtDataPoints; i++){
                pairsArray.push({x: Number(xVal), y: i+1});
            }
        });
        
        pairsArray.sort((a, b) => a.x - b.x);
        
        return pairsArray;
    },
    
    makeBoxPlotData: function(dataList, graphName = "Variable"){
        //TODO
        const sortedList = STAPPLET.UTILITY.sortAscending(dataList);
        
        const q1 = STAPPLET.DATA.findQ1(sortedList);
        const median = STAPPLET.DATA.findMedian(sortedList);
        const q3 = STAPPLET.DATA.findQ3(sortedList);
        
        const IQR = STAPPLET.DATA.findInterquartileRange(dataList);
        
        const lowerFence = q1 - 1.5 * IQR;
        const upperFence = q3 + 1.5 * IQR;
        
        //find min and max within non outliers
        const nonOutliers = sortedList.filter(d => d >= lowerFence && d <= upperFence);
        const min = d3.min(nonOutliers);
        const max = d3.max(nonOutliers);
        
        //find outliers
        const outliers = sortedList.filter(d => d < lowerFence || d > upperFence);
        
        //returns an object filled with all the necessary info for a box and whisker plot
        return {
            group: graphName,
            q1: q1,
            median: median,
            q3: q3,
            min: min,
            max: max
        };
    },
    
    makeNormalProbabilityPlotData: function(dataList){
        const sortedData = STAPPLET.UTILITY.sortAscending(dataList);
        const percentilesList = STAPPLET.DATA.makePercentiledList(dataList);
        const zScores = STAPPLET.DATA.makeInverseCDFList(percentilesList);

        const dataPoints = STAPPLET.UTILITY.pairData(sortedData, zScores);
        return dataPoints;
    }
};

//GRAPH GENERATION
STAPPLET.GRAPHS = {
    
    /* graph construction */
    
    //takes a list of data inputs and a canvas element id and uses it to construct a dotplot, and then display it
    //it does this by taking the data, counting the frequency of each item, and then plotting that on a 
    //scatterplot
    makeDotplot: function(dataList, graphElem, graphName){
        
        //get the points to add to the data
        const points = STAPPLET.DATA.createDotplotData(dataList);
        const maxY = d3.max(points, d => d.y);
        
        
        //get width, height, and margin info
        const width = STAPPLET.SETTINGS.graphSettings.width;
        //Height should scale properly up until around 20 datapoints on the same value, which most likely wont happen too often
        const height = Math.max(150, (STAPPLET.SETTINGS.userSettings.pointRadius * maxY) * (STAPPLET.SETTINGS.userSettings.pointRadius * 0.75));
        const margin = STAPPLET.SETTINGS.graphSettings.margins;

        //creating svg to add to div
        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
        //scale x and y axes
        const x = d3.scaleLinear()
            .domain(d3.extent(points, d => d.x))
            .range([margin.left, width - margin.right])
            .nice();
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(points, d => d.y) + 1])
            .range([height - margin.bottom, height - margin.bottom - maxY * 15]);
        
        
        //create and format points on graph --        
        
        //settings for styling
        const color = STAPPLET.SETTINGS.userSettings.pointColor;
        const pointRadius = STAPPLET.SETTINGS.userSettings.pointRadius;
        
        svg.selectAll("circle")
            .data(points)
            .join("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", pointRadius)
            .attr("fill", color)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);
        
        //set axes
        const xAxis = d3.axisBottom(x).ticks(6);
        
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
            
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 5)
            .text(graphName);
    },
    
    makeHistogram: function(dataList, graphElem, graphName){
        
        //VALUE CALCULATION AND DATA PROCESSING FOR HISTOGRAM
        
        //min and max values (step 1)
        const [minValue, maxValue] = STAPPLET.DATA.findMinAndMaxVals(dataList);
        
        //find bin sizes
        const binSize = STAPPLET.DATA.findBinSize(dataList);
        
        //find amt of bins based on data (step 2)
        const n = dataList.length;
        const amtBins = Math.ceil(Math.log2(n)+1)
        
        //generate bin ranges and frequencies (step 3)
        const binRanges = STAPPLET.DATA.makeBinRanges(dataList, binSize, amtBins, minValue);
        const frequencies = STAPPLET.DATA.binFrequencyFromData(dataList, binSize, amtBins);
        
        //generate bins in a single object mirroring d3 to allow for dynamic setting of bin sizing
        //from user settings in the future (step 4)
        const bins = binRanges.slice(0, -1).map((edge, i) => ({
            x0: edge,
            x1: binRanges[i + 1],
            length: frequencies[i]
        }));
        
        
        //GRAPH DISPLAY GENERATION
        
        //get width, height, and margin info
        const width = STAPPLET.SETTINGS.graphSettings.width;
        const height = STAPPLET.SETTINGS.graphSettings.height;
        const margin = STAPPLET.SETTINGS.graphSettings.margins;
        
        //creating svg to add to div
        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        //create x scale
        const xScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([margin.left, width - margin.right])
            .nice();
        
        //create y scale
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(frequencies)])
            .range([height - margin.bottom, margin.top]);
            
        //create display
        svg.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => yScale(0) - yScale(d.length))
            .attr("fill", STAPPLET.SETTINGS.userSettings.pointColor)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);
        
        //add x axis
        const xAxis = d3.axisBottom(xScale).ticks(6);
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        
        //add y axis
        const yAxis = d3.axisLeft(yScale).ticks(6);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
        
        //LABELS ---
        
        //x-axis label
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 5)
            .text(graphName);
        
        //y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .text("Frequency");
    },
    
    makeBoxplot: function(dataList, graphElem, graphName, ss = null) {
        let sumStat;
        if(ss != null){
            sumStat = [ss];
        } else{
            sumStat = [STAPPLET.DATA.makeBoxPlotData(dataList, graphName)];
        }
    
        //dimensions
        const width = STAPPLET.SETTINGS.graphSettings.width;
        const height = 200;
        const margin = STAPPLET.SETTINGS.graphSettings.margins;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
    
        //create the svg
        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
        const plot = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // X scale
        const x = d3.scaleLinear()
            .domain([sumStat[0].min, sumStat[0].max])
            .range([0, innerWidth])
            .nice();
    
        // Y scale
        const y = d3.scaleBand()
            .domain(sumStat.map(d => d.group))
            .range([innerHeight, 0])
            .padding(0.3);
    
        //axes
        plot.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));
    
        plot.append("g")
            .call(d3.axisLeft(y));
    
        // Box height (fixed, since only one group)
        const boxHeight = Math.min(40, y.bandwidth() * 0.6);
        const centerY = y(sumStat[0].group) + y.bandwidth() / 2;
    
        // Whisker line
        plot.selectAll(".whisker")
            .data(sumStat)
            .enter()
            .append("line")
            .attr("class", "whisker")
            .attr("x1", d => x(d.min))
            .attr("x2", d => x(d.max))
            .attr("y1", centerY)
            .attr("y2", centerY)
            .attr("stroke", "black");
    
        // Box (IQR)
        plot.selectAll(".box")
            .data(sumStat)
            .enter()
            .append("rect")
            .attr("class", "box")
            .attr("x", d => x(d.q1))
            .attr("y", centerY - boxHeight / 2)
            .attr("width", d => Math.abs(x(d.q3) - x(d.q1)))
            .attr("height", boxHeight)
            .attr("stroke", "black")
            .attr("fill", STAPPLET.SETTINGS.userSettings.pointColor)
            .attr("opacity", 0.95);
    
        // Median line
        plot.selectAll(".median")
            .data(sumStat)
            .enter()
            .append("line")
            .attr("class", "median")
            .attr("x1", d => x(d.median))
            .attr("x2", d => x(d.median))
            .attr("y1", centerY - boxHeight / 2)
            .attr("y2", centerY + boxHeight / 2)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    },
    
    makeBoxplotOverlay: function(dataList, graphElem) {
        const graphName = "overlay";
        const sumStat = [STAPPLET.DATA.makeBoxPlotData(dataList, graphName)];
    
        //dimensions
        const width = STAPPLET.SETTINGS.graphSettings.width;
        const height = 175;
        const margin = 0;
        const innerWidth = width;
        const innerHeight = height;
    
        //create the svg
        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
        const plot = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        // X scale
        const x = d3.scaleLinear()
            .domain([sumStat[0].min, sumStat[0].max])
            .range([0, innerWidth])
            .nice();
    
        // Y scale
        const y = d3.scaleBand()
            .domain(sumStat.map(d => d.group))
            .range([innerHeight, 0])
            .padding(0.3);
    
        // Box height (fixed, since only one group)
        const boxHeight = Math.min(100, y.bandwidth() * 0.6);
        const centerY = y(sumStat[0].group) + y.bandwidth() / 2;
    
        // Whisker line
        plot.selectAll(".whisker")
            .data(sumStat)
            .enter()
            .append("line")
            .attr("class", "whisker")
            .attr("x1", d => x(d.min))
            .attr("x2", d => x(d.max))
            .attr("y1", centerY)
            .attr("y2", centerY)
            .attr("stroke", "black");
    
        // Box (IQR)
        plot.selectAll(".box")
            .data(sumStat)
            .enter()
            .append("rect")
            .attr("class", "box")
            .attr("x", d => x(d.q1))
            .attr("y", centerY - boxHeight / 2)
            .attr("width", d => Math.abs(x(d.q3) - x(d.q1)))
            .attr("height", boxHeight)
            .attr("stroke", "black")
            .attr("fill", STAPPLET.SETTINGS.userSettings.pointColor)
            .attr("opacity", 0.95);
    
        // Median line
        plot.selectAll(".median")
            .data(sumStat)
            .enter()
            .append("line")
            .attr("class", "median")
            .attr("x1", d => x(d.median))
            .attr("x2", d => x(d.median))
            .attr("y1", centerY - boxHeight / 2)
            .attr("y2", centerY + boxHeight / 2)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    },
        
    makeNormalProbabilityPlot: function(dataList, graphElem, graphName){
        //TODO
        const dataInfo = STAPPLET.DATA.makeNormalProbabilityPlotData(dataList);

        const width = STAPPLET.SETTINGS.graphSettings.width;
        const height = STAPPLET.SETTINGS.graphSettings.height;
        const margin = STAPPLET.SETTINGS.graphSettings.margins;

        const color = STAPPLET.SETTINGS.userSettings.pointColor;
        const pointRadius = STAPPLET.SETTINGS.userSettings.pointRadius;
        

        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        //set scales    
        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataInfo, d => d.x))
            .range([margin.left, width - margin.right])
            .nice();
            
        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataInfo, d => d.y))
            .range([height - margin.bottom, margin.top])
            .nice();
        
        //draw points
        svg.selectAll("circle")
            .data(dataInfo)
            .join("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", pointRadius)
            .attr("fill", color)
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);
            
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 35)
            .text(graphName);
    
        const yAxis = d3.axisLeft(yScale);
        
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .text("Z-Scores");

        const { slope, intercept } = STAPPLET.DATA.computeLSRLInfo(dataInfo);

        const xMin = d3.min(dataInfo, d => d.x);
        const xMax = d3.max(dataInfo, d => d.x);

        const yMin = slope * xMin + intercept;
        const yMax = slope * xMax + intercept;

        svg.append("line")
            .attr("x1", xScale(xMin))
            .attr("y1", yScale(yMin))
            .attr("x2", xScale(xMax))
            .attr("y2", yScale(yMax))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            
        
    },
    
    makeScatterplot: function(dataList, graphElem, graphName){
        alert("scatterplot is not finished yet.");
    },
    
    makePieChart: function(dataList, graphElem, graphName){
        alert("pie chart is not finished yet.");
    }
};
