//wrap everything in a listener to make sure the dom content is loaded before adding any listeners or grabbing elements

document.addEventListener("DOMContentLoaded", function () {
  const lottieMakeAnimContainer = document.getElementById(
    "lottieAnimationMAKE",
  );
  const lottieMissAnimContainer = document.getElementById(
    "lottieAnimationMISS",
  );

  const lottieMAKEAnimation = lottie.loadAnimation({
    container: lottieMakeAnimContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "../ASSETS/MAKE.json",
  });

  const lottieMISSAnimation = lottie.loadAnimation({
    container: lottieMissAnimContainer,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "../ASSETS/MISS.json",
  });

  //Page state variables
  let primedForReset = false; //reset button active
  let mobileFlagged = false; //user is on mobile

  //shots information output and storage
  const shotsInfoOutput = document.getElementById("shotsInfoOutputText");
  const shotHistory = [];

  const populationHistory = [];

  //radius of dots on graph
  let radi = 5;

  //track the location of clicks on the graph
  const clickLocations = {
    first: 0,
    last: 0,
  };

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

  //checks the size of the screen to alter size if user is on mobile
  function scaleGraphToScreen() {
    const width = window.innerWidth;

    if (width <= 600) {
      mobileFlagged = true;

      MMAPPLETS.SETTINGS.graphSettings.width = width;
      MMAPPLETS.SETTINGS.graphSettings.smallRatioEnabled = true;
      MMAPPLETS.SETTINGS.graphSettings.margins = {
        top: 40,
        right: 100,
        bottom: 60,
        left: 0,
      };
    } else {
      mobileFlagged = false;
    }
  }

  //outputs the population history data to the graph svg
  function displayPopulationGraph() {
    scaleGraphToScreen();
    const graphElem = document.getElementById("graphOutput");
    graphElem.replaceChildren();

    const graphName = "Proportion of Made Shots";

    const points = createDotplotData(populationHistory);

    const maxY = d3.max(points, (d) => d.y);

    //get width, height, and margin info
    const height = 350;
    const width = MMAPPLETS.SETTINGS.graphSettings.width;
    const margin = MMAPPLETS.SETTINGS.graphSettings.margins;

    const availableHeight = height - margin.bottom;

    radi = calculateOptimalRadius(maxY, availableHeight * 0.8);

    const svg = MMAPPLETS.GRAPHS.makeSVG(graphElem, height, width);
    svg.attr("id", "mainOutputGraphSVG");

    hideGraphCount(); // clear previous graph count info to make sure inaccurate data isn't shown

    //scale x and y axes
    const x = MMAPPLETS.GRAPHS.makeScale(
      "linear",
      [0, 1],
      [margin.left, width - margin.right],
      {
        nice: true,
      },
    );

    const y = MMAPPLETS.GRAPHS.makeScale(
      "linear",
      [0, d3.max(points, (d) => d.y)],
      [
        height - margin.bottom,
        Math.max(0, height - margin.bottom - maxY * (radi * 2.2)),
      ],
    );

    //create and format points on graph
    MMAPPLETS.GRAPHS.drawCircles(svg, points, x, y, {
      radius: radi,
      stroke: "none",
      color: "rgb(62, 190, 180)",
    });

    //set axes
    const xAxis = MMAPPLETS.GRAPHS.makeXAxis(
      x,
      {
        tickValues: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      },
      {
        ticks: 11,
      },
    );

    const dragHandler = d3
      .drag()
      .on("start", (e) => {
        clickLocations.first = e.x;
        clickLocations.last = e.x;
      })
      .on("drag", (e) => {
        //update the visual as the user drags
        clickLocations.last = e.x;

        const svg = d3.select("#mainOutputGraphSVG");
        const width = parseFloat(svg.attr("width"));
        const margins = MMAPPLETS.SETTINGS.graphSettings.margins;

        const pixelToNorm = d3
          .scaleLinear()
          .domain([margins.left, width - margins.right])
          .range([0, 1]);

        let startNorm = pixelToNorm(clickLocations.first);
        let endNorm = pixelToNorm(clickLocations.last);
        startNorm = Math.max(0, Math.min(1, startNorm));
        endNorm = Math.max(0, Math.min(1, endNorm));

        // Count and display the region
        countAndDisplayRegion(startNorm, endNorm);
      })
      .on("end", (e) => {
        clickLocations.last = e.x;

        const svg = d3.select("#mainOutputGraphSVG");
        const width = parseFloat(svg.attr("width"));
        const margins = MMAPPLETS.SETTINGS.graphSettings.margins;

        const pixelToNorm = d3
          .scaleLinear()
          .domain([margins.left, width - margins.right])
          .range([0, 1]);

        let startNorm = pixelToNorm(clickLocations.first);
        let endNorm = pixelToNorm(clickLocations.last);
        startNorm = Math.max(0, Math.min(1, startNorm));
        endNorm = Math.max(0, Math.min(1, endNorm));

        // Count and display the region
        countAndDisplayRegion(startNorm, endNorm);
      });

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.call(dragHandler);
    MMAPPLETS.GRAPHS.addTextToAxis(svg, graphName, "x");
  }

  function updateOutputs() {
    displayPopulationGraph();
  }

  function displaySelectedGraphRegion(start, end) {
    const svg = d3.select("#mainOutputGraphSVG");
    svg.selectAll("rect").remove(); // remove any previous overlay

    const width = parseFloat(svg.attr("width"));
    const margins = MMAPPLETS.SETTINGS.graphSettings.margins;
    const plotWidth = width - margins.left - margins.right;

    //make sure start <= end
    if (start > end) {
      [start, end] = [end, start];
    }

    const xStart = margins.left + start * plotWidth;
    const rectWidth = (end - start) * plotWidth;

    const svgHeight = parseFloat(svg.attr("height"));
    const plotHeight = svgHeight - margins.bottom; // graph area height

    svg
      .append("rect")
      .attr("x", xStart)
      .attr("y", 0)
      .attr("width", rectWidth)
      .attr("height", plotHeight)
      .attr("fill", "rgba(255, 0, 0, 0.25)")
      .attr("stroke", "rgba(255, 0, 0, 0.5)")
      .attr("stroke-width", 1);
  }

  function hideGraphCount() {
    const svg = d3.select(document.getElementById("mainOutputGraphSVG"));
    svg.selectAll("rect").remove();

    const outputText = document.getElementById("outputAnalyzedCount");
    outputText.innerText = "";
  }

  function countAndDisplayRegion(low, high) {
    //low <= high
    if (low > high) {
      [low, high] = [high, low];
    }
    //clamp to range [0,1]
    low = Math.max(0, Math.min(1, low));
    high = Math.max(0, Math.min(1, high));

    const count = populationHistory.filter((p) => p >= low && p <= high).length;
    const total = populationHistory.length;
    const proportion = total > 0 ? (count / total).toFixed(2) : "0.00";

    const outputText = document.getElementById("outputAnalyzedCount");
    outputText.innerText = `There are ${count} samples (${proportion}) in the selected region.`;

    displaySelectedGraphRegion(low, high);
  }

  function doCountOnGraph() {
    const greaterOrLessThan = document.getElementById("lOrRSelDropdown").value;
    const baselineTxt = document.getElementById("analyzeDataInput").value;
    const baselineNum = Number(baselineTxt);

    if (isNaN(baselineNum) || baselineNum < 0 || baselineNum > 1) {
      alert("Input must be a numeric value between 0-1");
      return;
    }

    let low, high;
    if (greaterOrLessThan === "greater") {
      low = baselineNum;
      high = 1;
    } else {
      // "less"
      low = 0;
      high = baselineNum;
    }

    countAndDisplayRegion(low, high);
  }

  function resetApplet() {
    primedForReset = false;
    shotHistory.length = 0;
    radi = 5;

    // Reset UI elements
    document.getElementById("shootButton").innerText = "Shoot";
    document.getElementById("shotsInfoOutputText").innerText = "0/0 (0%)";
    document.getElementById("outputAnalyzedCount").innerText = "";
    document.getElementById("analyzeDataInput").value = "";
    document.getElementById("lOrRSelDropdown").value = "greater";
    document.getElementById("quickAddInput").value = "";

    // Reset Lottie animations to first frame and hide both containers
    lottieMISSAnimation.goToAndStop(0, true);
    lottieMAKEAnimation.goToAndStop(0, true);
    lottieMissAnimContainer.style.display = "none";
    lottieMakeAnimContainer.style.display = "block";
  }

  //plays the animation for the freethrow, 1 for make, 0 for miss
  function playFreethrowAnimation(madeThrow) {
    lottieMISSAnimation.goToAndStop(0, true);
    lottieMAKEAnimation.goToAndStop(0, true);
    if (madeThrow) {
      lottieMissAnimContainer.style.display = "none";
      lottieMakeAnimContainer.style.display = "block";

      lottieMAKEAnimation.play();
    } else {
      lottieMakeAnimContainer.style.display = "none";
      lottieMissAnimContainer.style.display = "block";

      lottieMISSAnimation.play();
    }
  }

  //updates the percentage visible next to the shots taken fraction
  function updateShotsResultField() {
    const numShotsTaken = shotHistory.length;
    const numShotsMade = shotHistory.reduce((accum, cur) => accum + cur, 0);
    const percentage = Number((numShotsMade / numShotsTaken).toFixed(2));

    shotsInfoOutput.innerText = `${numShotsMade}/${numShotsTaken} (${(percentage * 100).toFixed(0)}%)`;

    if (shotHistory.length == 50) {
      populationHistory.push(percentage);
    }
  }

  function attemptShot() {
    const shotResult = MMAPPLETS.UTIL.getRandomInt(1, 100);
    if (shotResult <= 80) {
      //play made animation and push to history
      shotHistory.push(1);
      playFreethrowAnimation(1);
    } else {
      //play missed animation and push to history
      shotHistory.push(0);
      playFreethrowAnimation(0);
    }
    updateShotsResultField();
  }

  //add listener to the quick add button
  document
    .getElementById("quickAddSimsBtn")
    .addEventListener("click", function () {
      const simsAmt = parseInt(document.getElementById("quickAddInput").value);
      for (let simIter = 0; simIter < simsAmt; simIter++) {
        //simulate 50 shots and push it to population history
        const tempSH = [];
        for (let st = 0; st < 50; st++) {
          const shotResult = MMAPPLETS.UTIL.getRandomInt(1, 100);
          if (shotResult <= 80) {
            tempSH.push(1);
          } else {
            tempSH.push(0);
          }
        }
        const numShotsTaken = 50;
        const numShotsMade = tempSH.reduce((accum, cur) => accum + cur, 0);
        const percentage = Number((numShotsMade / numShotsTaken).toFixed(2));
        populationHistory.push(percentage);
      }
      updateOutputs();
    });

  document.getElementById("countBtn").addEventListener("click", function () {
    doCountOnGraph();
  });

  document
    .getElementById("removeCountBtn")
    .addEventListener("click", function () {
      hideGraphCount();
    });

  document.getElementById("shootButton").addEventListener("click", function () {
    if (shotHistory.length < 49) {
      attemptShot();
    } else if (!primedForReset) {
      attemptShot();
      MMAPPLETS.UI.toggleElementVisibility("section2", "visible");
      document.getElementById("shootButton").innerText = "Start Over";
      primedForReset = true;
      updateOutputs();
    } else if (primedForReset) {
      resetApplet();
    }
  });

  window.addEventListener("resize", function () {
    scaleGraphToScreen();
    displayPopulationGraph();
  });
});
