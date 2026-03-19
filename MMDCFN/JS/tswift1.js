document.addEventListener("DOMContentLoaded", function () {
    const trueFanRatings = [92, 89, 90, 88, 95, 100, 98, 93, 95, 84, 82, 86, 90, 88, 86, 91, 90, 89, 85, 83, 80, 74, 80, 67, 81, 82, 76, 77, 74, 65, 72, 68, 74, 73, 70, 69, 72, 70, 68, 67, 69, 67, 68, 68, 64, 66, 63, 63, 70, 68];
    const meanHistoryPerMethod = [
        [],
        [],
        []
    ];
    //10x5
    //5 rows 10 columns
    const trueMean = 78.38;
    let radi = 5;
    let mobileFlagged = false;
    let showTrueValues = false;
    
    function createDotplotData(dataList) {
        // Convert and filter
        const numericData = dataList
        .map((x) => Math.round(Number(x) * 100) / 100)
        .filter((x) => !isNaN(x));

        // Count frequencies using map
        const frequencyMap = new Map();
        numericData.forEach((value) => {
        frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
        });

        // Create stacked coordinates
        const pairsArray = [];
        const sortedValues = Array.from(frequencyMap.keys()).sort((a, b) => a - b);

        sortedValues.forEach((value) => {
        const frequency = frequencyMap.get(value);
        for (let i = 0; i < frequency; i++) {
            pairsArray.push({
            x: value,
            y: i + 1,
            });
        }
        });

        return pairsArray;
    }

    function scaleGraphToScreen(){
        let height = window.innerHeight;
        let width = window.innerWidth;
        // alert(width);
        
        let availableWidth = (width <= 600) ? width * (1  - (0.05)) : width * (1 - (0.40 + 0.05));
        MMAPPLETS.SETTINGS.graphSettings.margins.left = (width <= 600) ? 10 : 60;
        let availableHeight = height * (1 - (0.66 + 0.03));
        MMAPPLETS.SETTINGS.graphSettings.height = availableHeight;
        MMAPPLETS.SETTINGS.graphSettings.width = availableWidth;
    }

    //calculates a radius for dots on the graph that appears neatly within the svg window
    function calculateOptimalRadius(maxY, availableHeight) {
        const MIN_RADIUS = 0.5;
        const MAX_RADIUS = mobileFlagged ? 3 : 5;

        if (maxY <= 1) return MAX_RADIUS;

        // Space needed per dot: diameter (2r) + vertical gap (0.5r) = 2.5r
        const SPACE_PER_DOT_MULTIPLIER = 2.2;

        // Calculate ideal radius
        let idealRadius = availableHeight / (maxY * SPACE_PER_DOT_MULTIPLIER);

        // Clamp between min and max
        return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, idealRadius));
    }

    function calculateHorizontalRadius(points, xScale) {
        if (points.length <= 1) return Infinity;

        const uniqueX = [...new Set(points.map(d => d.x))].sort((a, b) => a - b);

        if (uniqueX.length <= 1) return Infinity;

        let minPixelDist = Infinity;

        for (let i = 1; i < uniqueX.length; i++) {
            const dist = Math.abs(xScale(uniqueX[i]) - xScale(uniqueX[i - 1]));
            if (dist < minPixelDist) {
                minPixelDist = dist;
            }
        }

        const SPACE_MULTIPLIER = 2.2;

        return minPixelDist / SPACE_MULTIPLIER;
    }

    function displayEntries(entries){
        for(let i = 0; i < 50; i++){
            const associatedImage = document.getElementById("fanID" + (i + 1));
            if(entries.includes(i)){
                associatedImage.src = "../ASSETS/fanSelectedTSWIFT.png";
            } else{
                associatedImage.src = "../ASSETS/fanDefaultTSWIFT.png";
            }
        }

    }

    function getMeanFromEntries(entries){
        let entryVals = [];
        for(let entry of entries){
            entryVals.push(trueFanRatings[entry]);
        }

        return MMAPPLETS.MATH.calculateMean(entryVals);
    }

    function findDomainAllData(){
        const allDataPool = [];
        for(let list of meanHistoryPerMethod){
            for(let item of list){
                allDataPool.push(item);
            }
        }

        if(allDataPool.length != 0){
            return MMAPPLETS.MATH.findMinAndMaxVals(allDataPool);
        } else {
            return [77.5, 82.5]
        }
    }

    function activateShowTrueButton(){
        const showTrueButton = document.getElementById("showTrueValBtn");
        showTrueButton.style.backgroundColor = "#3EBEB1";
        showTrueButton.addEventListener('click', () => {
            const selectedElems = document.querySelectorAll(".trueValues");
            selectedElems.forEach(element => { 
                element.style.display = "block";
            });
            showTrueValues = true;
    
            document.getElementById("quickAddContainer").style.display = "flex";

            updateGraph(1);
            updateGraph(2);
            updateGraph(3);
        });

    }

    function updateGraph(methodNum){
        scaleGraphToScreen();
        const graphElem = "#graphOutput"  + methodNum;
        document.getElementById("graphOutput" + methodNum).replaceChildren();

        const origData = meanHistoryPerMethod[methodNum-1];

        let points = createDotplotData(origData);

        let graphName = "";
        if(methodNum == 1){
            graphName = "Average Enjoyment (SRS)"
        } else if(methodNum == 2){
            graphName = "Average Enjoyment (Stratified by Rows)"
        } else if(methodNum == 3){
            graphName = "Average Enjoyment (Stratified by Columns)";
        }

        const maxY = d3.max(points, (d) => d.y) || 1;

        let xDom = findDomainAllData();
        
        if(xDom[0] == xDom[1]){
            if(xDom[0] != undefined){
                xDom = [xDom[0] - 3, xDom[0] + 3];
            } else{
                xDom = [78, 82]
            }
        }


        //get width, height, and margin info
        const height = window.innerHeight * (1 - (0.66 + 0.125));
        const width = MMAPPLETS.SETTINGS.graphSettings.width;
        const margin = MMAPPLETS.SETTINGS.graphSettings.margins;

        const availableHeight = height - margin.bottom;

        
        const svg = MMAPPLETS.GRAPHS.makeSVG(graphElem, height, width);

        //scale x and y axes
        const x = MMAPPLETS.GRAPHS.makeScale(
        "linear",
        xDom,
        [margin.left, width - margin.right],
        {
            nice: true,
        },
        );

        const verticalRadius = calculateOptimalRadius(maxY, availableHeight * 0.8);
        const horizontalRadius = calculateHorizontalRadius(points, x);

        radi = Math.max(0.5, Math.min(verticalRadius, horizontalRadius, mobileFlagged ? 3 : 5));
        
        const y = MMAPPLETS.GRAPHS.makeScale(
            "linear",
            [0, maxY],
            [
                height - margin.bottom,
                Math.max(0, height - margin.bottom - maxY * (radi * 2.2)),
            ]
        );

        //create and format points on graph
        MMAPPLETS.GRAPHS.drawCircles(svg, points, x, y, {
            radius: radi,
            stroke: "none",
            color: "rgb(62, 190, 180)",
        });

        //set axes
        const xAxis = MMAPPLETS.GRAPHS.makeXAxis(
            x
        );
        
        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        if(showTrueValues){
            MMAPPLETS.GRAPHS.drawLine(svg, x(78.38), y(0), x(78.38), 0, {stroke: "red"});
        }
        MMAPPLETS.GRAPHS.addTextToAxis(svg, graphName, "x");
    }

    function getRandomEntriesFromMethod(methodNum, display = true){
        let entries = [];
        if(methodNum == 1){
            while(entries.length < 10){
                let entry = MMAPPLETS.UTIL.getRandomInt(0,49);
                if(!entries.includes(entry)){
                    entries.push(entry);
                }
            }
        }
        if(methodNum == 2){
            for(let i = 0; i < 5; i++){
                let row1 = MMAPPLETS.UTIL.getRandomInt(0,9);
                let row2 = MMAPPLETS.UTIL.getRandomInt(0,9);
                while(row2 == row1){
                    row2 = MMAPPLETS.UTIL.getRandomInt(0,9); //ensure that you don't sample the same person twice
                }
                entries.push(row1 + (i * 10));
                entries.push(row2 + (i * 10));
                
            }
        }
        if(methodNum == 3){
            for(let i = 0; i < 10; i++){
                entries.push(i + (MMAPPLETS.UTIL.getRandomInt(0,4) * 10))
            }
        }

        let mean = getMeanFromEntries(entries);

        document.getElementById("populationEnjoymentOutput").innerText = "Average enjoyment for the population: " + mean.toFixed(2);

        meanHistoryPerMethod[methodNum-1].push(mean);

        
        if(display == true){
            displayEntries(entries);
    
            updateGraph(1);
            updateGraph(2);
            updateGraph(3);
        }

        if(meanHistoryPerMethod[0].length > 0 && meanHistoryPerMethod[1].length > 0 && meanHistoryPerMethod[2].length > 0){
            activateShowTrueButton();
        }
    }

    function quickAddSamples(){
        const amountSamples = parseInt(document.getElementById("quickAddAmtInput").value);
        const outputTo = parseInt(document.getElementById("chooseMethodDropdown").value);
        for(let x = 0; x < amountSamples; x++){
            if(x != amountSamples - 1){
                getRandomEntriesFromMethod(outputTo, false);
            } else{
                getRandomEntriesFromMethod(outputTo);
            }
        }
    }

    updateGraph(1);
    updateGraph(2);
    updateGraph(3);

    document.getElementById("doSimType1btn").addEventListener('click', () => { getRandomEntriesFromMethod(1); });
    document.getElementById("doSimType2btn").addEventListener('click', () => { getRandomEntriesFromMethod(2); });
    document.getElementById("doSimType3btn").addEventListener('click', () => { getRandomEntriesFromMethod(3); });

    document.getElementById("quickAddButton").addEventListener('click', () => { quickAddSamples(); });
    
});
