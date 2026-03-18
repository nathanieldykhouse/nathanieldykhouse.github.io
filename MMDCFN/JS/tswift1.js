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
        let availableWidth = width * (1 - (0.40 + 0.05));
        let availableHeight = height * (1 - (0.66 + 0.03));
        MMAPPLETS.SETTINGS.graphSettings.height = availableHeight;
        MMAPPLETS.SETTINGS.graphSettings.width = availableWidth;
        console.log("sizesettings:\n");
        console.log(availableHeight);
        console.log(availableWidth);
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

        return MMAPPLETS.MATH.findMinAndMaxVals(allDataPool);
    }

    function updateGraph(methodNum){
        scaleGraphToScreen();
        const graphElem = "#graphOutput"  + methodNum;
        document.getElementById("graphOutput" + methodNum).replaceChildren();

        const origData = meanHistoryPerMethod[methodNum-1];

        let points = createDotplotData(origData);

        const graphName = "Average Enjoyment";

        const maxY = d3.max(points, (d) => d.y) || 1;

        const xDom = findDomainAllData();

        //get width, height, and margin info
        const height = window.innerHeight * (1 - (0.66 + 0.125));
        const width = MMAPPLETS.SETTINGS.graphSettings.width;
        const margin = MMAPPLETS.SETTINGS.graphSettings.margins;

        const availableHeight = height - margin.bottom;

        radi = calculateOptimalRadius(maxY, availableHeight * 0.8);

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
        console.log(svg);
        console.log("beans");
        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        console.log(origData);
        console.log(points);
        MMAPPLETS.GRAPHS.addTextToAxis(svg, graphName, "x");
    }


    /* START OF TEMP STUFF FOR NATHANIEL'S DEBUGGING*/
    

    /* END OF TEMP STUFF FOR NATHANIEL'S DEBUGGING*/
    
    function getRandomEntriesFromMethod(methodNum){
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

        displayEntries(entries);

        updateGraph(1);
        updateGraph(2);
        updateGraph(3);
    }

    document.getElementById("doSimType1btn").addEventListener('click', () => { getRandomEntriesFromMethod(1); });
    document.getElementById("doSimType2btn").addEventListener('click', () => { getRandomEntriesFromMethod(2); });
    document.getElementById("doSimType3btn").addEventListener('click', () => { getRandomEntriesFromMethod(3); });

    document.addEventListener('keydown', (e) => {
        if(e.key == 'y'){
            alert(meanHistoryPerMethod[0]);
        }
        if(e.key == 'u'){
            alert(meanHistoryPerMethod[1]);
        }
        if(e.key == 'i'){
            alert(meanHistoryPerMethod[2]);
        }
    });
    
});