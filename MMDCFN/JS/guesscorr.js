document.addEventListener('DOMContentLoaded', () => {
    let currentR = 0;
    
    let primedForReset = false;
    
    let lastPoints = [];
    
    function revealAnswer(){
        const guessInputField = document.getElementById("corrInput");
        const guessVal = parseFloat(guessInputField.value);
        
        const err = guessVal - currentR;
        
        const guessOutputHolder = document.getElementById("guessOutputHolder");
        
        let realValsOutputText = document.getElementById("realValuesInfo");
        let errorOutputText = document.getElementById("errorValOutputInfo");
        realValsOutputText.textContent = "Actual correlation: r = " + currentR.toFixed(3);
        errorOutputText.textContent = "Error (estimated - actual) = " + err.toFixed(3);
        guessOutputHolder.style.display = "flex";
        
    }
    
    function sizeGraphForDevice(){
        if(window.innerWidth <= 600){
            
            MMAPPLETS.SETTINGS.graphSettings.height = window.innerWidth * 0.95;
            MMAPPLETS.SETTINGS.graphSettings.width = MMAPPLETS.SETTINGS.graphSettings.height;
        } else{
            MMAPPLETS.SETTINGS.graphSettings.height = window.innerHeight * 0.68;
            MMAPPLETS.SETTINGS.graphSettings.width = MMAPPLETS.SETTINGS.graphSettings.height;
        }
    }
    
    function displayCorrelationGraph(points){
        const graphElem = "#graphOutput";
        document.getElementById("graphOutput").replaceChildren();

        //get width, height, and margin info
        
        const height = MMAPPLETS.SETTINGS.graphSettings.height;
        const width = MMAPPLETS.SETTINGS.graphSettings.width;
        const margin = MMAPPLETS.SETTINGS.graphSettings.margins;
        
        const availableHeight = height - margin.bottom;

        const radi = 4;

        const svg = MMAPPLETS.GRAPHS.makeSVG(graphElem, height, width);
        
        svg.append("defs").append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);
            
        const pointsContainer = svg.append("g")
            .attr("clip-path", "url(#chart-area)");
        
        const minAndMaxY = MMAPPLETS.MATH.findMinAndMaxVals(points.map(d => d.y));
        const minAndMaxX = MMAPPLETS.MATH.findMinAndMaxVals(points.map(d => d.x));
        
        const xPadding = (minAndMaxX[1] - minAndMaxX[0]) * 0.05;
        const yPadding = (minAndMaxY[1] - minAndMaxY[0]) * 0.05;
        
        //scale x and y axes
        const x = MMAPPLETS.GRAPHS.makeScale(
            "linear",
            [minAndMaxX[0] - xPadding, minAndMaxX[1]],
            [margin.left, width - margin.right],
            {
                nice: true
            }
        );

        const y = MMAPPLETS.GRAPHS.makeScale(
            "linear",
            [minAndMaxY[0] - yPadding, minAndMaxY[1]],
            [
                height - margin.bottom,
                margin.top
            ], {
                nice: true
            }
        );

        //create and format points on graph
        MMAPPLETS.GRAPHS.drawCircles(pointsContainer, points, x, y, {
            radius: radi,
            stroke: "none",
            color: "rgb(62, 190, 180)",
        });
        
        //set axes
        const xAxis = MMAPPLETS.GRAPHS.makeXAxis(
            x
        );
        
        const yAxis = MMAPPLETS.GRAPHS.makeYAxis(
            y
        );
        
        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
            
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);
            
    }
    
    function applyGraphSettings(){
        MMAPPLETS.SETTINGS.graphSettings.margins = {top: 20, left: 40, right: 40, bottom: 40};
    }
    
    function redoApplet(){
        document.getElementById("guessOutputHolder").style.display = "none";
        generateCorrelationGraph();
    }
    
    function generateCorrelationGraph(){
        let points = [];
        const xMid = (Math.random() * 200) - 100;
        const yMid = (Math.random() * 200) - 100;   
        const n = 25; //amount of generated points
        
        const r = (Math.random() * 2) - 1;
        
        const xStd = Math.random() * 25 + 5;
        const yStd = Math.random() * 25 + 5;
        
        const scalarX = Math.max(Math.random(), 0.20);
        const scalarY = Math.max(Math.random(), 0.20);
        
        for (let i = 0; i < n; i++) {
            //generate correlated random points
            const u1 = Math.random(), u2 = Math.random();
            const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
            
            const cx = z1;
            const cy = r * z1 + Math.sqrt(1 - Math.pow(r, 2)) * z2;
            const x = ((cx * xStd) + xMid) * scalarX;
            const y = ((cy * yStd) + yMid) * scalarY;
            
            //clamp points and ensure there isn't a 'wall' of points (straight vertical or horizontal line as an artifact of clamping)
            if( y >= -100 && y <= 100 && x >= -100 && x <= 100){
                points.push({
                    x: Math.max(-100, Math.min(100, x)),
                    y: Math.max(-100, Math.min(100, y))
                });
            }
        }
        
        currentR = r;
        
        lastPoints = points;
        
        displayCorrelationGraph(points);
    }
    
    window.addEventListener('resize', () => {
        displayCorrelationGraph(lastPoints);
        sizeGraphForDevice();
    });
    
    document.getElementById("revealAnswerBtn").addEventListener('click', () => {
        if(!primedForReset){
            revealAnswer();
            document.getElementById("revealAnswerBtn").textContent = "Try again!";
            primedForReset = true;
        } else{
            document.getElementById("revealAnswerBtn").textContent = "Reveal Answer";
            redoApplet();
            primedForReset = false;
        }
    });
    
    sizeGraphForDevice();
    applyGraphSettings();
    generateCorrelationGraph();
});
