//wrap everything in a listener to make sure the dom content is loaded before adding any listeners or grabbing elements

document.addEventListener("DOMContentLoaded", function(){
    const lottieMakeAnimContainer = document.getElementById('lottieAnimationMAKE');
    const lottieMissAnimContainer = document.getElementById('lottieAnimationMISS');
    
    const lottieMAKEAnimation = lottie.loadAnimation({
        container: lottieMakeAnimContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'MAKE.json'
    });
    
    const lottieMISSAnimation = lottie.loadAnimation({
        container: lottieMissAnimContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'MISS.json'
    });
    
    const shotsInfoOutput = document.getElementById('shotsInfoOutputText');
    const shotHistory = [];
    
    const populationHistory = [];
    
    var radi = 5;

    function updateFiveNumSum(){
        // alert("called update fns");
        const fns = MMAPPLETS.MATH.getFiveNumSumFromList(populationHistory);
        const nOutput = document.getElementById("nOutput");
        const meanOutput = document.getElementById("meanOutput");
        const SDOutput = document.getElementById("SDOutput");
        const minOutput = document.getElementById("minOutput");
        const Q1Output = document.getElementById("Q1Output");
        const medOutput = document.getElementById("medOutput");
        const Q3Output = document.getElementById("Q3Output");
        const maxOutput = document.getElementById("maxOutput");
        nOutput.innerText = populationHistory.length;
        minOutput.innerText = fns.min.toFixed(2);
        maxOutput.innerText = fns.max.toFixed(2);
        meanOutput.innerText = fns.mean.toFixed(2);
        SDOutput.innerText = fns.SD.toFixed(2);
        Q1Output.innerText = fns.q1.toFixed(2);
        medOutput.innerText = fns.med.toFixed(2);
        Q3Output.innerText = fns.q3.toFixed(2);
    }
    
    function createDotplotData(dataList){
        // Convert and filter
        const numericData = dataList.map(x => Math.round(Number(x) * 100) / 100).filter(x => !isNaN(x));
        
        // Count frequencies using map
        const frequencyMap = new Map();
        numericData.forEach(value => {
            frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
        });
        
        // Create stacked coordinates
        const pairsArray = [];
        const sortedValues = Array.from(frequencyMap.keys()).sort((a, b) => a - b);
        
        sortedValues.forEach(value => {
            const frequency = frequencyMap.get(value);
            for(let i = 0; i < frequency; i++) {
                pairsArray.push({x: value, y: i + 1});
            }
        });
        
        // alert("len of pairs array: " + pairsArray.length);
        
        return pairsArray;
    }
    
    function calculateOptimalRadius(maxY, availableHeight) {
        const MIN_RADIUS = 0.5;
        const MAX_RADIUS = 5;
        const DEFAULT_RADIUS = 5;
        
        if (maxY <= 1) return DEFAULT_RADIUS;
        
        // Space needed per dot: diameter (2r) + vertical gap (0.5r) = 2.5r
        const SPACE_PER_DOT_MULTIPLIER = 2.2;
        
        // Calculate ideal radius
        let idealRadius = availableHeight / (maxY * SPACE_PER_DOT_MULTIPLIER);
        
        // Clamp between min and max
        return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, idealRadius));
    }
    
    function displayPopulationGraph(){
        const graphElem = document.getElementById("graphOutput");
        graphElem.replaceChildren();
        
        const graphName = "Proportion of Made Shots";
        
        
        const points = createDotplotData(populationHistory);
        
        const maxY = d3.max(points, d => d.y);
        
        //get width, height, and margin info
        const height = 350;
        const width = MMAPPLETS.SETTINGS.graphSettings.width;
        const margin = MMAPPLETS.SETTINGS.graphSettings.margins;
        
        const availableHeight = height - margin.bottom;
        
        radi = calculateOptimalRadius(maxY, availableHeight*0.8);
        
        // Simple scaling based on max stack height
        const pointDiameter = radi * 2;
        const verticalGap = radi * 0.5;
        const contentHeight = Math.min(350, maxY * (pointDiameter + verticalGap));
        // const height = Math.max(150, contentHeight + margin.top + margin.bottom);
        
        
        const svg = MMAPPLETS.GRAPHS.makeSVG(graphElem, height, width);
        svg.attr("id", "mainOutputGraphSVG");
        
        
        hideGraphCount();
        
        //scale x and y axes
        const x = MMAPPLETS.GRAPHS.makeScale('linear', [0,1], [margin.left, width - margin.right], {nice: true});
        
        const y = MMAPPLETS.GRAPHS.makeScale('linear', [0, d3.max(points, d => d.y)], [height - margin.bottom, Math.max(0, height - margin.bottom - maxY * (radi*2.20))]);
        
        
        const highestY = d3.max(points, d => d.y);
        
        //create and format points on graph --        
        MMAPPLETS.GRAPHS.drawCircles(svg, points, x, y, {radius: radi, stroke: "none"});
        
        //set axes
        const xAxis = MMAPPLETS.GRAPHS.makeXAxis(x, {
            tickValues: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        }, {ticks: 11});
        
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        
        MMAPPLETS.GRAPHS.addTextToAxis(svg, graphName, 'x');
    }
    
    function updateOutputs(){
        updateFiveNumSum();
        displayPopulationGraph();
    }
    
    function displaySelectedGraphRegion(start, end){
        
        const svg = d3.select(document.getElementById("mainOutputGraphSVG"));
        
        svg.selectAll("rect").remove();

        const wid = svg.attr("width");
        const margins = MMAPPLETS.SETTINGS.graphSettings.margins;
        const xLoc = margins.left+((wid-margins.left-margins.right)*start);
        const width = (start < end) ? wid-xLoc-margins.right : xLoc-margins.left;
        
        const hit = svg.attr("height");
        
        const height = hit-margins.bottom;
        
        svg.append("rect")
            .attr("x", (start < end) ? xLoc : margins.left)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "rgba(62, 190, 177, 0.25")
            .attr("stroke", "rgba(62, 190, 180, 0.5")
            .attr("stroke-width", 1);
    }
    
    function hideGraphCount(){
        const svg = d3.select(document.getElementById("mainOutputGraphSVG"));
        svg.selectAll("rect").remove();
        
        const outputText = document.getElementById("outputAnalyzedCount");
        outputText.innerText = "";
    }
    
    function doCountOnGraph(){
        const greaterOrLessThan = document.getElementById('lOrRSelDropdown').value;
        // alert(greaterOrLessThan);
        let baselineTxt = document.getElementById('analyzeDataInput').value;
        const baselineNum = Number(baselineTxt);
        if(typeof(baselineNum) === 'number'){
            const outputText = document.getElementById('outputAnalyzedCount');
            if(baselineNum >= 0 && baselineNum <= 1){
                if(greaterOrLessThan == 'greater'){
                    let amountGreaterThan = 0;
                    for(let x = 0; x < populationHistory.length; x++){
                        if(populationHistory[x] >= baselineNum){
                            amountGreaterThan++;
                        }
                    }
                    outputText.innerText = "There are " + amountGreaterThan + " samples (" + (amountGreaterThan/populationHistory.length).toFixed(2) + ") in the selected region.";
                    displaySelectedGraphRegion(baselineNum, 1);
                } else if(greaterOrLessThan == 'less'){
                    let amountLessThan = 0;
                    for(let x = 0; x < populationHistory.length; x++){
                        if(populationHistory[x] <= baselineNum){
                            amountLessThan++;
                        }
                    }
                    outputText.innerText = "There are " + amountLessThan + " samples (" + (amountLessThan/populationHistory.length).toFixed(2) + ") in the selected region.";
                    displaySelectedGraphRegion(baselineNum, 0);
                }
            } else{
                alert("Input must be a numeric value between 0-1");
            }
        } else{
            alert("Input must be a numeric value between 0-1");
        }
        
    }
    
    //plays the animation for the freethrow, 1 for make, 0 for miss (effectively boolean)
    function playFreethrowAnimation(madeThrow){
        lottieMISSAnimation.goToAndStop(0, true);
        lottieMAKEAnimation.goToAndStop(0, true);
        if(madeThrow == 1){
            lottieMissAnimContainer.style.display = 'none';
            lottieMakeAnimContainer.style.display = 'block';
            
            lottieMAKEAnimation.play();
            
        } else{
            lottieMakeAnimContainer.style.display = 'none';
            lottieMissAnimContainer.style.display = 'block';
            
            lottieMISSAnimation.play();
        }
    }
    
    function updateShotsResultField(){
        const numShotsTaken = shotHistory.length;
        const numShotsMade = shotHistory.reduce((accum, cur) => accum + cur, 0);
        const percentage = Number((numShotsMade / numShotsTaken).toFixed(2));
        
        
        shotsInfoOutput.innerText = `${numShotsMade}/${numShotsTaken} (${percentage}%)`;
        
        if(shotHistory.length == 50){
            populationHistory.push(percentage);
            document.getElementById('shootButton').innerText = "Continue";
        }
    }
    
    function attemptShot(){
        const shotResult = MMAPPLETS.UTIL.getRandomInt(1,100);
        if(shotResult <= 80){
            shotHistory.push(1);
            playFreethrowAnimation(1);
        } else{
            shotHistory.push(0);
            playFreethrowAnimation(0);
        }
        updateShotsResultField();
    }
    
    document.getElementById('quickAddSimsBtn').addEventListener('click', function(){
        const simsAmt = parseInt(document.getElementById('quickAddInput').value);
        // alert('quickadding');
        for(let simIter = 0; simIter < simsAmt; simIter++){
            const tempSH = [];
            for(let st = 0; st < 50; st++){
                const shotResult = MMAPPLETS.UTIL.getRandomInt(1,100);
                if(shotResult <= 80){
                    tempSH.push(1);
                } else{
                    tempSH.push(0);
                }
            }
            const numShotsTaken = 50;
            const numShotsMade = tempSH.reduce((accum, cur) => accum + cur, 0);
            const percentage = Number((numShotsMade / numShotsTaken).toFixed(2));
            populationHistory.push(percentage);
            // alert('pushing ' + percentage + ' to pophist');
        }
        updateOutputs();
    });
    
    document.getElementById('countBtn').addEventListener('click', function(){
        doCountOnGraph();
    });
    
    document.getElementById('removeCountBtn').addEventListener('click', function(){
        hideGraphCount();
    });
    
    document.getElementById('shootButton').addEventListener('click', function(){
        if(shotHistory.length < 50){
            attemptShot();
        } else{
            MMAPPLETS.UI.toggleElementDisplay('section1');
            MMAPPLETS.UI.toggleElementDisplay('section2', 'flex');
            updateOutputs();
        }
    });
});
