var STAPPLET = STAPPLET || { };

//SETTINGS HANDLING
STAPPLET.SETTINGS = {
    userSettings: {
        pointRadius: 5,
        pointColor: 'rgb(255, 93, 125)'
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
    
    makeDropdown: function(ID, dropdownOptions, dropdownValues, dropdownClasses = null){
        const newDropdown = document.createElement("select");
        newDropdown.id = ID;
        if(dropdownOptions.length > 0){
            dropdownOptions.forEach((value, index) =>{
                const newOption = document.createElement("option");
                newOption.value = dropdownValues[index];
                newOption.textContent = value;
                newDropdown.appendChild(newOption);
            });
        }
        if(dropdownClasses != null){
            dropdownClasses.forEach((value, index) =>{
                newDropdown.classList.add(value);
            });
        }
        return newDropdown;
    }
};

//UTILITY FUNCTIONS
STAPPLET.UTILITY = {
    isValidInteger: function(str){
        const num = parseInt(str, 10);
        return !isNaN(num) && String(num) === String(str); 
    }
};

//DATA PROCESSING
STAPPLET.DATA = {
    
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
    
    makeBinRanges: function(dataList, binSize, amtBins){
        const minVal = Math.floor(Math.min(...dataList));
        
        //create bin edges
        const binRanges = [];
        for(let i = 0; i <= amtBins; i++){
            binRanges.push(minVal + i * binSize);
        }
        
        return binRanges;
    }
};

//GRAPH GENERATION
STAPPLET.GRAPHS = {
    
    /* graph construction */
    
    //takes a list of data inputs and a canvas element id and uses it to construct a dotplot, and then display it
    //it does this by taking the data, counting the frequency of each item, and then plotting that on a 
    //scatterplot
    makeDotplot: function(dataList, graphElem, graphName){
        
        //erase previous graph
        STAPPLET.UI.clearDiv(graphElem);
        
        //get the points to add to the data
        const points = STAPPLET.DATA.createDotplotData(dataList);
        
        //settings for graph
        const width = 400;
        const height = 250;
        const margin = { top: 40, right: 20, bottom: 40, left: 40 };
        
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
        
        const maxY = d3.max(points, d => d.y);
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
    },
    
    makeHistogram: function(dataList, canvasElem, graphName){
        //erase previous graph
        STAPPLET.UI.clearDiv(graphElem);
        
        //settings for graph
        const width = 400;
        const height = 250;
        const margin = { top: 40, right: 20, bottom: 40, left: 40 };
        
        //creating svg to add to div
        const svg = d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
        //create x axis
        const xScale = d3.scaleLinear()
            .domain([d3.min(dataList, d => +d.value), d3.max(dataList, d => +d.value)])
    }
};
