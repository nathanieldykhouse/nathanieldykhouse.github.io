document.addEventListener("DOMContentLoaded", () => {

    const STATE = {
        INIT: 0,
        CONVENIENCE_READY: 1,
        SRS_READY: 2,
        SHOW_TRUE: 3
    };

    let appState = STATE.INIT;

    const textData = `
    I look and stare so deep in your eyes
    I touch on you more and more every time
    When you leave I'm begging you not to go
    Call your name two or three times in a row
    Such a funny thing for me to try to explain
    How I'm feeling and my pride is the one to blame
    'Cuz I know I don't understand
    Just how your love can do what no one else can
    
    Got me looking so crazy right now, your love's
    Got me looking so crazy right now (in love)
    Got me looking so crazy right now, your touch
    Got me looking so crazy right now (your touch)
    Got me hoping you'll page me right now, your kiss
    Got me hoping you'll save me right now
    Looking so crazy in love's
    Got me looking, got me looking so crazy in love
    
    When I talk to my friends so quietly
    Who he think he is? Look at what you did to me
    Tennis shoes, don't even need to buy a new dress
    If you ain't there ain't nobody else to impress
    The way that you know what I thought I knew
    It's the beat my heart skips when I'm with you
    But I still don't understand
    Just how the love your doing no one else can
    
    I'm looking so crazy in love's
    Got me looking, got me looking so crazy in love
    
    Got me looking, so crazy, my baby
    I'm not myself lately, I'm foolish, I don't do this
    I've been playing myself, baby I don't care
    'Cuz your love's got the best of me
    And baby you're making a fool of me
    You got me sprung and I don't care who sees
    'Cuz baby you got me, you got me, so crazy baby
    HEY!`;

    function extractWords(text) {
        return text.toLowerCase().match(/\b[\w']+\b/g) || [];
    }

    const words = extractWords(textData);
    const wordLengths = words.map(w => w.length);
    const populationSize = wordLengths.length;

    const meanHistory = [[], [], []];
    const selectedWords = new Set();

    const graphTitles = [
        "Average Word Length (Convenience)",
        "Average Word Length (SRS 5)",
        "Average Word Length (SRS 20)"
    ];

    const trueMean = MMAPPLETS.MATH.calculateMean(wordLengths);

    let showTrue = false;

    function createDotplotData(data) {
        const freq = new Map();

        data
            .map(x => Math.round(Number(x) * 100) / 100)
            .filter(x => !isNaN(x))
            .forEach(v => freq.set(v, (freq.get(v) || 0) + 1));

        const points = [];

        [...freq.keys()].sort((a, b) => a - b).forEach(v => {
            for (let i = 0; i < freq.get(v); i++) {
                points.push({ x: v, y: i + 1 });
            }
        });

        return points;
    }

    function scaleGraph() {
        const h = window.innerHeight;
        const w = window.innerWidth;

        MMAPPLETS.SETTINGS.graphSettings.margins.left = w <= 600 ? 10 : 60;
        MMAPPLETS.SETTINGS.graphSettings.height = h * 0.43;
        MMAPPLETS.SETTINGS.graphSettings.width = w <= 600 ? w * 0.95 : w * 0.55;
    }

    function getRandomSample(size) {
        const indices = Array.from({ length: populationSize }, (_, i) => i);

        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        return indices.slice(0, size);
    }

    function getMean(indices) {
        return MMAPPLETS.MATH.calculateMean(indices.map(i => wordLengths[i]));
    }

    function getDomain() {
        const all = meanHistory.flat();
        return all.length
            ? MMAPPLETS.MATH.findMinAndMaxVals(all)
            : [trueMean - 1, trueMean + 1];
    }

    function getHorizontalRadius(points, x) {
        if (points.length <= 1) return Infinity;

        const xs = [...new Set(points.map(p => p.x))].sort((a, b) => a - b);
        let min = Infinity;

        for (let i = 1; i < xs.length; i++) {
            const d = Math.abs(x(xs[i]) - x(xs[i - 1]));
            if (d < min) min = d;
        }

        return min / 2.2;
    }

    function updateGraph(method) {
        scaleGraph();

        const container = document.getElementById("graphOutput" + (method + 1));
        container.replaceChildren();

        const data = meanHistory[method];
        const points = createDotplotData(data);

        const height = MMAPPLETS.SETTINGS.graphSettings.height;
        const width = MMAPPLETS.SETTINGS.graphSettings.width;
        const margin = MMAPPLETS.SETTINGS.graphSettings.margins;

        const svg = MMAPPLETS.GRAPHS.makeSVG("#graphOutput" + (method + 1), height, width);

        let xDom = getDomain();
        if (xDom[0] === xDom[1]) xDom = [xDom[0] - 1, xDom[1] + 1];

        const x = MMAPPLETS.GRAPHS.makeScale(
            "linear",
            xDom,
            [margin.left, width - margin.right],
            { nice: true }
        );

        const maxY = d3.max(points, d => d.y) || 1;

        const radius = Math.min(
            height / (maxY * 3),
            getHorizontalRadius(points, x),
            5
        );

        const y = MMAPPLETS.GRAPHS.makeScale(
            "linear",
            [0, maxY],
            [height - margin.bottom, height - margin.bottom - maxY * (radius * 2.2)]
        );

        MMAPPLETS.GRAPHS.drawCircles(svg, points, x, y, {
            radius,
            color: "rgb(62, 190, 180)"
        });

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(MMAPPLETS.GRAPHS.makeXAxis(x));

        if (showTrue) {
            MMAPPLETS.GRAPHS.drawLine(svg, x(trueMean), y(0), x(trueMean), 0, { stroke: "red" });
        }

        MMAPPLETS.GRAPHS.addTextToAxis(svg, graphTitles[method], "x");

        if (
            meanHistory[0].length &&
            meanHistory[1].length &&
            meanHistory[2].length &&
            appState === STATE.SRS_READY
        ) {
            document.getElementById("quickAddContainer").style.display = "flex";
            document.getElementById("showTrueValBtn").style.backgroundColor = "#3EBEBE";
        }
    }

    document.getElementById("doSimType1btn").addEventListener("click", () => {
        if (selectedWords.size !== 5) return;

        const mean = MMAPPLETS.MATH.calculateMean(
            [...selectedWords].map(w => w.length)
        );

        meanHistory[0].push(mean);

        document.getElementById("yourSampleLenOutput").textContent =
            `Your sample average word length: ${mean.toFixed(2)}`;

        if (appState === STATE.CONVENIENCE_READY) {
            appState = STATE.SRS_READY;

            document.getElementById("doSimType2btn").style.backgroundColor = "#3EBEBE";
            document.getElementById("doSimType3btn").style.backgroundColor = "#3EBEBE";
        }
    });

    document.getElementById("doSimType2btn").addEventListener("click", () => {
        if (appState < STATE.SRS_READY) return;

        const mean = getMean(getRandomSample(5));
        meanHistory[1].push(mean);

        document.getElementById("lastSimWordLenOutput").textContent =
            `Sample average word length: ${mean.toFixed(2)}`;

        updateGraph(1);
        updateGraph(2);
    });

    document.getElementById("doSimType3btn").addEventListener("click", () => {
        if (appState < STATE.SRS_READY) return;

        const mean = getMean(getRandomSample(20));
        meanHistory[2].push(mean);

        document.getElementById("lastSimWordLenOutput").textContent =
            `Sample average word length: ${mean.toFixed(2)}`;

        updateGraph(1);
        updateGraph(2);
    });

    document.getElementById("quickAddButton").addEventListener("click", () => {
        const amount = Math.max(0, Number(document.getElementById("quickAddAmtInput").value) || 0);
        const method = Number(document.getElementById("chooseMethodDropdown").value);

        for (let i = 0; i < amount; i++) {
            const size = method === 1 ? 5 : 20;
            meanHistory[method].push(getMean(getRandomSample(size)));
        }

        updateGraph(1);
        updateGraph(2);
    });

    document.getElementById("showTrueValBtn").addEventListener("click", () => {

        const hasAllData =
            meanHistory[0].length &&
            meanHistory[1].length &&
            meanHistory[2].length;

        if (!hasAllData) return;

        showTrue = true;

        document.getElementById("trueMeanInfo").style.visibility = "visible";

        updateGraph(1);
        updateGraph(2);
    });

    function renderText() {
        const outputDiv = document.getElementById("lyricsContainer");
        const lines = textData.trim().split("\n");

        lines.forEach((line, i) => {
            // treat apostrophes as part of the word visually
            const tokens = line.match(/[\w']+|[^\w\s]+|\s+/g);

            tokens.forEach(token => {
                if (/^[\w']+$/.test(token)) {  // word with apostrophe
                    const span = document.createElement("span");
                    span.textContent = token;

                    span.addEventListener("click", e => {
                        const word = e.target.textContent;

                        if (!selectedWords.has(word) && selectedWords.size < 5) {
                            // store the word length ignoring apostrophes
                            selectedWords.add(word);

                            e.target.classList.add("selectedWord");

                            if (selectedWords.size === 5 && appState === STATE.INIT) {
                                appState = STATE.CONVENIENCE_READY;
                                document.getElementById("doSimType1btn").style.backgroundColor = "#3EBEBE";
                            }
                        }
                    });

                    outputDiv.appendChild(span);
                } else {
                    outputDiv.appendChild(document.createTextNode(token));
                }
            });

            if (i < lines.length - 1) {
                outputDiv.appendChild(document.createElement("br"));
            }
        });
    }

    renderText();
    updateGraph(1);
    updateGraph(2);

});
