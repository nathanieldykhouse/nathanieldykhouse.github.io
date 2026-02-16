var MMAPPLETS = MMAPPLETS || { };

MMAPPLETS.SETTINGS = {
    userSettings: {
        pointRadius: 5,
        pointColor: 'rgb(255, 93, 125)'
    },
    
    graphSettings: {
        height: 700,
        width: 600,
        margins: {top: 40, right: 20, bottom: 60, left: 60},
        smallRatioEnabled: false
        
    }
};

MMAPPLETS.UI = {
    //Changes the visibility of a given element to visible or invisible
    toggleElementVisibility: function(elementId){
        const elem = document.getElementById(elementId);
        
        //garuntee element's existence
        if(typeof(elem) != null){
            const currentElemVisibility = elem.style.visibility;
            if(currentElemVisibility == 'visible'){
                //disable visibility for element
                elem.style.visibility = 'hidden';
            } else{
                //return to default value
                elem.style.visibility = 'visible';
            }
        } else{
            console.log("ERROR: Cannot toggle visibility of nonexistent element of id " + elementId);
        }
    },
    
    //Similar to toggleElementVisibility but changes display value to make the element take up no rendered DOM space
    toggleElementDisplay: function(elementId, newVal = -1){
        const elem = document.getElementById(elementId);
        
        //garuntee element's existence
        if(typeof(elem) != null){
            if(newVal == -1){
                
                const currentElemDisplay = window.getComputedStyle(elem).display;
                if(currentElemDisplay != 'none'){
                    //disable visibility for element
                    elem.style.display = 'none';
                } else{
                    //return to default value
                    elem.style.display = 'block';
                }
            } else{
                elem.style.display = newVal;
            }
        } else{
            console.log("ERROR: Cannot toggle display of nonexistent element of id " + elementId);
        }
    }
};

MMAPPLETS.UTIL = {
    getRandomInt: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    sortAscending: function(dataList){
        return [...dataList].sort(d3.ascending);
    }
};

MMAPPLETS.MATH = {
    
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
        const mean = MMAPPLETS.MATH.calculateMean(dataList);
        
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
    
    findQ1: function(dataList){
        const sortedList = MMAPPLETS.UTIL.sortAscending(dataList);
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
        const sortedList = MMAPPLETS.UTIL.sortAscending(dataList);
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
        const sortedList = MMAPPLETS.UTIL.sortAscending(dataList);
        const n = sortedList.length;
        if (n % 2 === 0) {
            return (sortedList[n / 2 - 1] + sortedList[n / 2]) / 2;
        }
        return sortedList[Math.floor(n / 2)];
    },
    
    getFiveNumSumFromList: function(inpList){
        const numericList = inpList
            .map(Number)
            .filter(x => !Number.isNaN(x) && Number.isFinite(x));
        const minAndMax = MMAPPLETS.MATH.findMinAndMaxVals(numericList);
        const Q1 = MMAPPLETS.MATH.findQ1(numericList);
        const Q3 = MMAPPLETS.MATH.findQ3(numericList);
        const mean = MMAPPLETS.MATH.calculateMean(numericList);
        const SD = MMAPPLETS.MATH.calculateStandardDeviation(numericList);
        const median = MMAPPLETS.MATH.findMedian(numericList);
        
        return {min: minAndMax[0], max: minAndMax[1], mean: mean, q1: Q1, q3: Q3, SD: SD, med: median};
    }
};

MMAPPLETS.GRAPHS = {
    /* graph construction helpers */
    makeSVG: function(graphElem, height, width){
        return d3.select(graphElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("width", width + "px")
            .style ("height", height + "px");
    },
    
    makeScale: function(type, domain, range, options = {}){
        let newScale;
        
        //account for type of scale (band or linear)
        
        switch(type){
            case 'band':
                newScale = d3.scaleBand()
                    .domain(domain)
                    .range(range)
                    .padding(options.padding || 0.3);
                break;
            default:
                newScale = d3.scaleLinear()
                    .domain(domain)
                    .range(range);
                if (options.nice) newScale = newScale.nice();
                break;
        }
        
        return newScale;
        
    },
    
    makeXAxis: function(scale, options = {}){
        const axis = d3.axisBottom(scale);
        
        if(options.tickValues){
            axis.tickValues(options.tickValues);
        } else if(options.ticks){
            axis.ticks(options.ticks);
        }
        
        if(options.tickFormat){
            axis.tickFormat(options.tickFormat);
        }
        
        return axis;
    },
    
    makeYAxis: function(scale, options = {}){
        const axis = d3.axisLeft(scale);
        if (options.ticks) axis.ticks(options.ticks);
        return axis;
    },
    
    addTextToAxis: function(svg, text, axisType, options = {}){
        let width = +svg.attr("width");
        const height = +svg.attr("height");
        const margin = options.margin || MMAPPLETS.SETTINGS.graphSettings.margins;
        
        if(MMAPPLETS.SETTINGS.graphSettings.smallRatioEnabled){
            width = width - margin.left - margin.right;
        }
        
        const label = svg.append("text")
            .attr("class", `${axisType}-axis-label`)
            .attr("text-anchor", "middle")
            .text(text);
        
        if(axisType === "x"){
            label.attr("x", width / 2 )
                .attr("y", height - margin.bottom / (options.offset || 5));
        } else if (axisType === 'y') {
            label.attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", margin.left / (options.offset || 3));
        }
        
        return label;
    },
    
    drawCircles: function(svg, data, xScale, yScale, options = {}){
        const color = options.color || MMAPPLETS.SETTINGS.userSettings.pointColor;
        const radius = options.radius || MMAPPLETS.SETTINGS.userSettings.pointRadius;
        
        return svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", radius)
            .attr("fill", color)
            .attr("stroke", options.stroke || "black")
            .attr("stroke-width", options.strokeWidth || 0.5);
            
    },
    
    drawLine: function(svg, x1, y1, x2, y2, options = {}){
        return svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", options.stroke || "black")
            .attr("stroke-width", options.strokeWidth || 2)
            .attr("fill", options.fill || "none");
    },
    
    drawBoxes: function(svg, data, xScale, yScale, options = {}) {
        return svg.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => yScale(0) - yScale(d.length))
            .attr("fill", options.fill || MMAPPLETS.SETTINGS.userSettings.pointColor)
            .attr("stroke", options.stroke || "black")
            .attr("stroke-width", options.strokeWidth || 0.5);
    },
}
