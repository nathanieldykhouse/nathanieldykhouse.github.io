const trueFanRatings = [92, 89, 90, 88, 95, 100, 98, 93, 95, 84, 82, 86, 90, 88, 86, 91, 90, 89, 85, 83, 80, 74, 80, 67, 81, 82, 76, 77, 74, 65, 72, 68, 74, 73, 70, 69, 72, 70, 68, 67, 69, 67, 68, 68, 64, 66, 63, 63, 70, 68];
const meanHistoryPerMethod = [
    [],
    [],
    []
];
const audienceMemberTransformations = {
    audienceMemberPhaseOffset: [],
    audienceMemberSpeed: [],
    audienceMemberAmplitude: [],

    audienceMemberBodyRotationPhase: [],
    audienceMemberBodyRotationSpeed: [],
    audienceMemberBodyRotationAmplitude: []
};

const audienceMemberOriginalData = {
    audienceMemberHeadHeight: [],
    audienceMemberBodyRotation: []
};

const graphTitles = {
    a: "Average Enjoyment (SRS)",
    b: "Average Enjoyment (Stratify by Row)",
    c: "Average Enjoyment (Stratify by Column)"
};

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

function changeInitialAudienceMemberAppearance(){
    for(let i = 0; i < 50; i++){
        const associatedAudienceMemberHead = document.getElementById("Head-" + (i + 1));
        const baseY = associatedAudienceMemberHead.getBBox().y + (associatedAudienceMemberHead.getBBox().height / 2);
        audienceMemberOriginalData.audienceMemberHeadHeight.push(baseY);
        audienceMemberTransformations.audienceMemberPhaseOffset.push(Math.random() * Math.PI * 2);
        audienceMemberTransformations.audienceMemberSpeed.push(0.0080);

        const associatedBody = document.getElementById("Body-" + (i + 1));
        audienceMemberOriginalData.audienceMemberBodyRotation.push(0);
        audienceMemberTransformations.audienceMemberBodyRotationPhase.push(Math.random() * Math.PI * 2);
        audienceMemberTransformations.audienceMemberBodyRotationSpeed.push(0.005);
        audienceMemberTransformations.audienceMemberBodyRotationAmplitude.push(5);
    }

    requestAnimationFrame(animateAudienceMembers);
}

function animateAudienceMembers(time){
    for(let i = 0; i < 50; i++){
        const associatedAudienceMemberHead = document.getElementById("Head-" + (i + 1));

        const baseY = audienceMemberOriginalData.audienceMemberHeadHeight[i];
        const phase = audienceMemberTransformations.audienceMemberPhaseOffset[i];
        const speed = audienceMemberTransformations.audienceMemberSpeed[i];

        const amplitude = 1.25;

        const yOffset = amplitude * Math.sin(time * speed + phase);

        associatedAudienceMemberHead.setAttribute(
            'cy',
            baseY + yOffset
        );


        const associatedBody = document.getElementById("Body-" + (i + 1));

        const rotPhase = audienceMemberTransformations.audienceMemberBodyRotationPhase[i];
        const rotSpeed = audienceMemberTransformations.audienceMemberBodyRotationSpeed[i];
        const rotAmp = audienceMemberTransformations.audienceMemberBodyRotationAmplitude[i];

        const rotation = rotAmp * Math.sin(time * rotSpeed + rotPhase);
        const bbox = associatedBody.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        associatedBody.setAttribute(
            "transform",
            `rotate(${rotation}, ${cx}, ${cy})`
        );

    }

    requestAnimationFrame(animateAudienceMembers);
}

function displayTrueValuesOnSVG(){
    document.querySelectorAll("#audienceMembers g").forEach((member, i) => {
        
        const body = member.querySelector("path");
        if (!body) return;

        const bbox = body.getBBox();

        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;

        const number = trueFanRatings[i];

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", centerX);
        text.setAttribute("y", centerY + 3); // tweak it to center the text
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "19");
        text.setAttribute("font-weight", "bold");
        text.setAttribute("fill", "#333");
        text.setAttribute("pointer-events", "none");

        text.textContent = number;

        member.appendChild(text);
    });
}

function displayEntries(entries){
    for(let i = 0; i < 50; i++){
        let member = document.getElementById("member" + (i + 1));
        const associatedAudienceMemberHead = document.getElementById("Head-" + (i + 1));
        const associatedAudienceMemberBody = document.getElementById("Body-" + (i + 1));
        let associatedText = document.getElementById("text-" + (i + 1));
        
        if(entries.includes(i)){
            if(associatedAudienceMemberBody.classList.contains('active')) continue;
            associatedAudienceMemberHead.classList.replace('inactive', 'active');
            associatedAudienceMemberBody.classList.replace('inactive', 'active');
            if(!showTrueValues){
                const bbox = associatedAudienceMemberBody.getBBox();
        
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;
                
        
                const number = trueFanRatings[i];
        
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", centerX);
                text.setAttribute("y", centerY + 3); // tweak it to center the text
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-size", "19");
                text.setAttribute("id", "text-" + (i + 1));
                text.setAttribute("font-weight", "bold");
                text.setAttribute("fill", "#333");
                text.setAttribute("pointer-events", "none");
        
                text.textContent = number;
        
                member.appendChild(text);
            }
        } else{
            if(associatedText != null && !showTrueValues){
                associatedText.remove();
            }
            if(associatedAudienceMemberBody.classList.contains('inactive')) continue;
            associatedAudienceMemberHead.classList.replace('active', 'inactive');
            associatedAudienceMemberBody.classList.replace('active', 'inactive');
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
        if(!showTrueValues){
            const selectedElems = document.querySelectorAll(".trueValues");
            selectedElems.forEach(element => { 
                element.style.display = "block";
            });
            showTrueValues = true;
    
            document.getElementById("quickAddContainer").style.display = "flex";
    
            displayTrueValuesOnSVG();
    
            updateGraph(1);
            updateGraph(2);
            updateGraph(3);
        }
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
        graphName = graphTitles.a;
    } else if(methodNum == 2){
        graphName = graphTitles.b;
    } else if(methodNum == 3){
        graphName = graphTitles.c;
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